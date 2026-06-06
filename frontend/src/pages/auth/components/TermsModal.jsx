import { X, ShieldCheck } from 'lucide-react';
import { brand } from '../../../utils/theme';

const TERMS = [
  {
    title: 'Авторські права на відео',
    text: 'Завантажуючи або додаючи посилання на відео, Ви підтверджуєте, що маєте всі необхідні права на використання цього контенту. Mist не несе відповідальності за порушення авторських прав третіх сторін.',
  },
  {
    title: 'Музичні треки та звуки',
    text: 'AI-підібрані музичні треки надаються виключно для використання в рамках платформи Mist. Треки ліцензовані для комерційного використання в соціальних мережах.',
  },
  {
    title: 'Обробка та зберігання даних',
    text: 'Ми зберігаємо мінімально необхідний обсяг персональних даних. Ваші відео та згенерований контент не передаються третім сторонам і не використовуються для навчання AI-моделей без Вашої явної згоди.',
  },
  {
    title: 'Поширення згенерованого контенту',
    text: 'Контент, створений за допомогою Mist, є Вашою власністю. Ви маєте право публікувати його на будь-яких платформах.',
  },
  {
    title: 'Обмеження відповідальності',
    text: "Mist надає сервіс \"як є\". Ми не гарантуємо безперебійну роботу та не несемо відповідальності за непрямі збитки.",
  },
];

const TermsModal = ({ onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
    onClick={onClose}>
    <div
      className="w-full max-w-md rounded-2xl p-7 relative max-h-[80vh] overflow-y-auto"
      style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}
      onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-4 right-4 text-[#bbb] hover:text-[#888] transition-colors">
        <X size={18} />
      </button>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: brand.gradientLight }}>
        <ShieldCheck size={20} className="text-[#D63384]" />
      </div>
      <h2 className="text-[18px] font-extrabold text-[#1A1A1A] mb-1">Умови використання</h2>
      <p className="text-[12px] text-[#aaa] mb-5">Останнє оновлення: червень 2025</p>

      {TERMS.map((section, i) => (
        <div key={i} className="mb-4">
          <h3 className="text-[13px] font-bold text-[#1A1A1A] mb-1">{section.title}</h3>
          <p className="text-[12px] text-[#666] leading-relaxed">{section.text}</p>
        </div>
      ))}

      <button
        onClick={onClose}
        className="w-full mt-2 py-3 rounded-full text-white text-[13px] font-semibold"
        style={{ background: brand.gradient }}>
        Зрозуміло
      </button>
    </div>
  </div>
);

export default TermsModal;