import { useState } from 'react';
import { Shield, Settings, Plus, Download, X } from 'lucide-react';

const CONTENT = {
  how: {
    title: 'How it works',
    body: `Paste in the text of any terms of service, privacy policy, or user agreement — or drop in a link and we'll fetch it for you. Our AI reads through the whole document and breaks it down into a plain-English summary, flags anything concerning (like data sharing, arbitration clauses, or auto-renewal traps), and explains legal jargon along the way. You get a clear risk rating so you know, at a glance, whether it's safe to click "I agree."`,
  },
  about: {
    title: 'About Fine Print',
    body: `Fine Print exists because almost nobody reads the terms and conditions they agree to — the documents are long, dense, and written in language most people find hard to parse. This tool uses AI to translate that fine print into something you can actually understand in a minute or two, so you can make informed decisions about the services you use.`,
  },
  privacy: {
    title: 'Privacy',
    body: `The text or URLs you submit are sent to our AI provider to generate your analysis, and are not stored or used for any purpose beyond producing your result. We don't require an account, and we don't track what documents you analyze. This tool is for informational purposes only and is not a substitute for legal advice.`,
  },
  settings: {
    title: 'Settings',
    body: `Settings aren't available yet — this is an early version of Fine Print. Future versions may include options like preferred language, saved analysis history, and export format preferences.`,
  },
};

function NavBar({ variant = 'home', onNewAnalysis, onDownload }) {
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
      <div className="bg-white border-b border-[#E5E1D8] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-[#1B4332]" />
          <span className="font-serif text-lg font-bold text-[#1B4332]">Fine Print</span>
        </div>

        {variant === 'home' ? (
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
              <button onClick={() => setOpenModal('how')} className="hover:text-[#1B4332]">How it works</button>
              <button onClick={() => setOpenModal('about')} className="hover:text-[#1B4332]">About</button>
              <button onClick={() => setOpenModal('privacy')} className="hover:text-[#1B4332]">Privacy</button>
            </nav>
            <button
              onClick={() => setOpenModal('settings')}
              className="w-8 h-8 rounded-full bg-[#F3F1EA] flex items-center justify-center"
            >
              <Settings size={15} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-1.5 text-sm border border-[#1B4332] text-[#1B4332] rounded-md px-4 py-2 font-medium hover:bg-[#F3F7F4] transition-colors"
            >
              <Plus size={14} />
              New Analysis
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 text-sm bg-[#1B4332] text-white rounded-md px-4 py-2 font-medium hover:bg-[#153726] transition-colors"
            >
              <Download size={14} />
              Download Report
            </button>
          </div>
        )}
      </div>

      {openModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setOpenModal(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <h2 className="font-serif text-xl text-[#1B4332] mb-3">{CONTENT[openModal].title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{CONTENT[openModal].body}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;