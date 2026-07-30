const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const SYSTEM_PROMPT = `You are a legal-plain-English translator. You will be given the text of a terms of service, privacy policy, or user agreement. Analyze it and respond with ONLY a raw JSON object, no markdown fences, no preamble, matching exactly this schema:

{
  "risk_level": "Low" | "Medium" | "High",
  "verdict": "one or two sentence plain-English overall summary",
  "red_flags": ["short plain-English red flag", ...],
  "categories": [
    {"name": "Privacy & data", "summary": "..."},
    {"name": "Billing & renewal", "summary": "..."},
    {"name": "Your rights", "summary": "..."},
    {"name": "Liability", "summary": "..."},
    {"name": "Termination & changes", "summary": "..."}
  ],
  "clauses": [
    {"original": "short verbatim excerpt under 200 chars", "plain": "plain-English translation"}
  ],
  "legal_terms": [
    {"term": "jargon word from the text", "definition": "one-sentence plain definition"}
  ],
  "confidence_note": "If any part of the document was ambiguous, contradictory, or too vague to summarize confidently, briefly say so here in one sentence. Otherwise, leave this as an empty string."
}

Output nothing but the JSON object.`;

app.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.length < 40) {
      return res.status(400).json({ error: 'Please provide valid terms and conditions text.' });
    }

    const MAX_CHARS = 60000; // Gemini 3.6 Flash has a huge context window, this is generous
    let truncated = text;
    let wasTruncated = false;

    if (text.length > MAX_CHARS) {
      truncated = text.slice(0, MAX_CHARS);
      wasTruncated = true;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nDocument text:\n${truncated}` }] }]
        })
      }
    );

    const data = await response.json();
    console.log('GEMINI RAW RESPONSE:', JSON.stringify(data, null, 2));
    
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    raw = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');

    const parsed = JSON.parse(raw);
    parsed.was_truncated = wasTruncated;
    parsed.original_length = text.length;
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong analyzing the document.' });
  }
});

app.post('/fetch-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ error: 'Please provide a valid URL.' });
    }

    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!pageRes.ok) {
      return res.status(400).json({ error: `That page returned an error (status ${pageRes.status}). Double-check the URL is correct.` });
    }

    const html = await pageRes.text();

    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    $('script, style, nav, header, footer').remove();

    const text = $('body').text().replace(/\s+/g, ' ').trim();

    if (text.length < 100) {
      return res.status(400).json({ error: 'Could not extract readable text from that page.' });
    }

    res.json({ text: text.slice(0, 15000) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch that URL.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});