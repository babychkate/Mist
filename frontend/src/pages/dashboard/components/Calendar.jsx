import { ChevronLeft, ChevronRight } from 'lucide-react';
import { brand } from '../../../utils/theme';

const MONTH_NAMES = ['Січень','Лютий','Березень','Квітень','Травень','Червень',
                     'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

const Calendar = ({ month, year, activeDays, loading, onPrev, onNext }) => {
  const today = new Date();
  const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
  const todayDay = isCurrentMonth ? today.getDate() : null;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ d: prevMonthDays - i, other: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d });
  while (cells.length % 7 !== 0) cells.push({ d: cells.length - daysInMonth - startOffset + 1, other: true });

  return (
    <div className="rounded-2xl p-4 border border-white/75"
      style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(16px)', boxShadow: '0 3px 12px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-[#1A1A1A]">{MONTH_NAMES[month - 1]} {year}</span>
        <div className="flex gap-1">
          <button onClick={onPrev} disabled={loading}
            className="w-6 h-6 rounded-md border border-black/10 flex items-center justify-center text-[#aaa] hover:bg-black/0.04 transition-colors disabled:opacity-40">
            <ChevronLeft size={12} />
          </button>
          <button onClick={onNext} disabled={loading}
            className="w-6 h-6 rounded-md border border-black/10 flex items-center justify-center text-[#aaa] hover:bg-black/0.04 transition-colors disabled:opacity-40">
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-[#ccc] pb-1">{d}</div>
        ))}
        {cells.map((item, i) => {
          const isToday = !item.other && item.d === todayDay;
          const hasActivity = !item.other && activeDays.includes(item.d);
          return (
            <div key={i}
              className="relative flex items-center justify-center aspect-square rounded-md transition-all hover:bg-black/0.04"
              style={isToday ? { background: brand.gradient } : hasActivity ? { background: brand.bgLight } : {}}>
              <span className={`text-xs leading-none ${
                isToday ? 'text-white font-bold' :
                item.other ? 'text-[#ddd]' :
                hasActivity ? 'text-[#D63384] font-bold' :
                'text-[#888]'
              }`}>{item.d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;