import { Sparkles, Music2 } from 'lucide-react';
import { brand } from '../../../utils/theme';

const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PLATFORM_BADGES = [
  { label: 'Instagram', bg: '#fce4ec', color: '#c2185b', border: '#f48fb1' },
  { label: 'TikTok',    bg: '#f3e5f5', color: '#4a148c', border: '#ce93d8' },
  { label: 'LinkedIn',  bg: '#e3f2fd', color: '#0d47a1', border: '#90caf9' },
];

const MockCard = () => (
  <div className="relative py-6 px-3.5">
    <div className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap z-10"
      style={{ background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.9)', boxShadow: '0 6px 20px rgba(0,0,0,0.09)' }}>
      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
      Генерую пост для Instagram...
    </div>

    <div className="rounded-3xl p-5"
      style={{ background: brand.glassFull, backdropFilter: brand.blur, border: brand.borderGlass, boxShadow: brand.shadowCard }}>
      <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
        style={{ background: 'rgba(0,0,0,0.04)' }}>
        <div className="w-2 h-2 rounded-full bg-[#E8799A]" />
        <span className="text-xs text-[#aaa] flex-1">youtube.com/watch?v=abc123XyZ</span>
      </div>

      <div className="w-full h-28 rounded-xl overflow-hidden mb-3 relative flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#1a1a2e,#0f3460)' }}>
        <div className="absolute bottom-2 left-2 right-2 text-xs text-white/80 font-semibold leading-snug">
          Як запустити стартап з нуля у 2025 році — повний гайд
        </div>
        <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          <IconPlay />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3"
        style={{ background: 'rgba(245,200,66,0.10)', border: '0.5px solid rgba(245,200,66,0.35)' }}>
        <Music2 size={13} className="text-yellow-600 shrink-0" />
        <span className="text-xs text-yellow-800 font-medium flex-1">Lo-fi chill beat — підібрано AI</span>
        <div className="flex-1 h-0.5 rounded-full bg-yellow-200 overflow-hidden">
          <div className="w-2/5 h-full bg-yellow-400 rounded-full" />
        </div>
        <span className="text-xs text-yellow-700">0:42</span>
      </div>

      <div className="flex gap-2 mb-3">
        {PLATFORM_BADGES.map(c => (
          <span key={c.label} className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: c.bg, color: c.color, border: `0.5px solid ${c.border}` }}>
            {c.label}
          </span>
        ))}
      </div>

      <div className="w-full py-3 rounded-xl text-white text-xs font-semibold text-center flex items-center justify-center gap-1"
        style={{ background: brand.gradient }}>
        Згенерувати mist <Sparkles size={12} />
      </div>
    </div>

    <div className="absolute bottom-0 left-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap"
      style={{ background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.9)', boxShadow: '0 6px 20px rgba(0,0,0,0.09)' }}>
      <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
      <Sparkles size={10} className="text-purple-500" /> AI підібрав тон для LinkedIn
    </div>
  </div>
);

export default MockCard;