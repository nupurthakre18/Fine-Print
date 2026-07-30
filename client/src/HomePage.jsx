import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Link2, Sparkles, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import NavBar from './NavBar';

function HomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (text.trim().length < 40) {
      setError('Paste more text — that looks too short.');
      return;
    }
    setError('');
    setLoading(true);

    try {
        const res = await fetch('https://fine-print-g0xl.onrender.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      navigate('/results', { state: { result: data } });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAndAnalyze = async () => {
    if (!url.trim().startsWith('http')) {
      setError('Enter a valid URL starting with http:// or https://');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const fetchRes = await fetch('https://fine-print-g0xl.onrender.com/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const fetchData = await fetchRes.json();
      if (fetchData.error) throw new Error(fetchData.error);

       const res = await fetch('https://fine-print-g0xl.onrender.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fetchData.text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      navigate('/results', { state: { result: data } });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <NavBar variant="home" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E1D8] p-8 sm:p-10">

          <p className="text-xs font-bold tracking-widest uppercase text-[#2F855A] mb-3 text-center">
            Fine print, made legible
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl mb-3 text-center text-[#1B4332]">
            Read it, without <em className="italic">reading</em> it.
          </h1>
          <p className="text-gray-500 text-center max-w-md mx-auto mb-8">
            Paste any terms of service, privacy policy, or user agreement below.
          </p>

          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'text' ? 'bg-[#1B4332] text-white' : 'bg-[#F3F1EA] text-gray-600'
              }`}
            >
              <FileText size={14} />
              Paste text
            </button>
            <button
              onClick={() => setMode('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'url' ? 'bg-[#1B4332] text-white' : 'bg-[#F3F1EA] text-gray-600'
              }`}
            >
              <Link2 size={14} />
              Paste URL
            </button>
          </div>

          {mode === 'text' ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the terms and conditions text here..."
              className="w-full min-h-[180px] p-4 text-sm border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
          ) : (
            <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/terms"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-full p-4 text-sm border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
           />
          )}

          <button
            onClick={mode === 'text' ? analyze : fetchAndAnalyze}
            disabled={loading}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-[#1B4332] text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-[#153726] transition-colors disabled:opacity-50"
          >
            <Sparkles size={16} />
            {loading ? 'Analyzing...' : 'Analyze terms'}
          </button>

          {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E8F3EC] flex items-center justify-center">
              <ShieldCheck size={16} className="text-[#2F855A]" />
            </div>
            <p className="text-sm font-medium text-[#1B4332]">Privacy First</p>
            <p className="text-xs text-gray-500">Your data stays with you.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E8F3EC] flex items-center justify-center">
              <Zap size={16} className="text-[#2F855A]" />
            </div>
            <p className="text-sm font-medium text-[#1B4332]">AI Powered</p>
            <p className="text-xs text-gray-500">Advanced AI finds what matters most.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E8F3EC] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#2F855A]" />
            </div>
            <p className="text-sm font-medium text-[#1B4332]">Plain English</p>
            <p className="text-xs text-gray-500">Complex legal terms, made simple.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;