import { ArrowRight } from 'lucide-react';
import { brand } from '../../../utils/theme';

const STEPS = [
  { dot: 'bg-green-500', text: 'Аналізую субтитри відео...', badge: true },
  { dot: 'bg-purple-500', text: 'Тон підібрано для LinkedIn', badge: false },
  { dot: 'bg-yellow-400', text: 'Lo-fi chill beat — підібрано AI', badge: false },
];

const LeftPanel = () => (
  <div className="hidden lg:flex flex-col items-center justify-center flex-[0_0_60%] px-14 py-14 gap-8 relative z-10">
    <div>
      <div className="text-4xl font-extrabold tracking-tight bg-linear-to-br from-[#E8799A] to-[#D63384] bg-clip-text text-transparent text-center mb-3">
        mist
      </div>
      <p className="text-[15px] text-[#555] text-center leading-relaxed max-w-xs mx-auto">
        Ваш відеоконтент тепер<br />
        <span className="font-bold text-[#1A1A1A]">працює на Вас всюди</span>
      </p>
    </div>

    <div className="w-full max-w-95 rounded-[18px] overflow-hidden border border-white/80 shadow-xl"
      style={{ background: brand.glass, backdropFilter: brand.blur }}>
      <div className="px-3 py-2 border-b border-black/5 flex items-center gap-2"
        style={{ background: 'rgba(0,0,0,0.04)' }}>
        <div className="text-[10px] text-[#aaa] flex-1 text-center bg-black/5 rounded-md py-1 px-2">
          youtube.com/watch?v=abc123XyZ
        </div>
      </div>
      <div className="w-full h-35 relative flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 50%)' }} />
        <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center relative z-10"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
          <ArrowRight size={14} color="white" />
        </div>
        <div className="absolute bottom-2 left-3 right-3 text-[9px] text-white/85 font-semibold leading-snug z-10">
          Як запустити стартап з нуля у 2025 — повний гайд для початківців
        </div>
      </div>
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
          style={{ background: brand.gradient }}>М</div>
        <div className="flex-1">
          <div className="text-[10px] font-semibold text-[#1A1A1A]">Максим Коваль</div>
          <div className="text-[9px] text-[#aaa]">Business UA · 1 день тому</div>
        </div>
        <div className="text-[9px] text-[#bbb]">48K переглядів</div>
      </div>
    </div>

    <div className="flex flex-col gap-2 w-full max-w-95">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3 border border-white/80 shadow-sm"
          style={{ background: brand.glass, backdropFilter: brand.blur }}>
          <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
          <span className="text-[12px] text-[#444] font-medium flex-1">{s.text}</span>
          {s.badge && (
            <span className="text-[9px] font-semibold text-green-700 bg-green-500/10 border border-green-500/25 rounded-full px-2 py-0.5">
              live
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default LeftPanel;