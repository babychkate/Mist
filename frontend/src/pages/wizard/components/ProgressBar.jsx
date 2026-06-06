import { Check } from 'lucide-react';
import { brand } from '../../../utils/theme';

const STEP_LABELS = ['Відео та платформи', 'Налаштування', 'Огляд'];

const ProgressBar = ({ current }) => (
  <div className="flex items-center justify-center border-b border-black/5 sticky top-14.5 z-30"
    style={{ padding: '14px 40px', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}>
    {STEP_LABELS.map((label, i) => {
      const state = i < current ? 'done' : i === current ? 'active' : 'idle';
      return (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={state === 'idle'
                ? { background: 'rgba(0,0,0,0.06)', color: '#bbb' }
                : { background: brand.gradient, color: 'white', boxShadow: state === 'active' ? '0 4px 12px rgba(214,51,132,0.3)' : 'none' }}>
              {state === 'done' ? <Check size={11} strokeWidth={3} /> : i + 1}
            </div>
            <span className="text-xs whitespace-nowrap"
              style={{
                fontWeight: state === 'active' ? 600 : 500,
                color: state === 'active' ? '#1A1A1A' : state === 'done' ? '#D63384' : '#bbb',
              }}>
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className="mx-2 h-px shrink-0"
              style={{ width: 48, background: state === 'done' ? brand.gradient : 'rgba(0,0,0,0.1)' }} />
          )}
        </div>
      );
    })}
  </div>
);

export default ProgressBar;