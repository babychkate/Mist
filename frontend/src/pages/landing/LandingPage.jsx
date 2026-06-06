import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Download, Music2, LayoutGrid, Play } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import PlatformIcon from '../../components/ui/PlatformIcon';
import CtaButton from './components/CtaButton';
import MockCard from './components/MockCard';
import { brand } from '../../utils/theme'

const STEPS = [
  { num: '1', title: 'Даєте лінк — ми робимо магію', desc: 'Просто вставте URL з YouTube, а Mist за мить витягне субтитри, сенси та метадані' },
  { num: '2', title: 'Обираєте вайб та формат', desc: 'Вибирайте соцмережі та тон голосу — від професійного до зухвалого. AI адаптує текст під кожну платформу' },
  { num: '3', title: 'Забираєте готовий контент', desc: 'Тексти, хештеги, музика та візуал вже чекають. Копіюйте окремо або завантажуйте все одним ZIP-архівом' },
];

const WHO_CARDS = [
  { icon: <Play size={18} />, name: 'YouTube блогер', desc: 'Публікуй відео — і одразу отримуй пости для всіх соцмереж автоматично' },
  { icon: <Zap size={18} />, name: 'Підприємець', desc: 'Просувай бізнес через відео без окремого SMM-спеціаліста у команді' },
  { icon: <Sparkles size={18} />, name: 'Контент-мейкер', desc: 'Адаптуй один відосик під усі платформи за хвилину без зайвих зусиль' },
  { icon: <LayoutGrid size={18} />, name: 'Маркетолог', desc: 'Масштабуй контент-стратегію без збільшення бюджету та команди' },
  { icon: <Music2 size={18} />, name: 'Музикант', desc: 'Просувай релізи та кліпи одразу на всіх платформах без зайвих витрат' },
  { icon: <Download size={18} />, name: 'Фрілансер', desc: 'Будуй особистий бренд без витрат на маркетинг і зайвого часу' },
];

const PLATFORM_NAMES = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter/X'];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF7', color: '#1A1A1A' }}>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: '#f48fb1', top: -180, right: -80, opacity: .2, filter: 'blur(90px)' }} />
        <div className="absolute rounded-full" style={{ width: 380, height: 380, background: '#F5C842', bottom: '15%', left: -120, opacity: .12, filter: 'blur(90px)' }} />
        <div className="absolute rounded-full" style={{ width: 280, height: 280, background: '#E8799A', top: '45%', right: '8%', opacity: .1, filter: 'blur(90px)' }} />
      </div>

      <Navbar variant="landing" />

      <section className="relative z-10 min-h-[calc(100vh-57px)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-12 py-12 grid grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#D63384] mb-5"
              style={{ background: 'rgba(232,121,154,0.12)', border: brand.border }}>
              <Sparkles size={11} /> AI-driven контент-асистент
            </div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tighter mb-4">
              Ваше відео.<br />
              <span className="bg-linear-to-br from-[#E8799A] to-[#D63384] bg-clip-text text-transparent">
                Всі платформи.
              </span><br />
              За хвилину.
            </h1>
            <p className="text-base leading-relaxed text-[#555] mb-8">
              Автоматично генеруйте адаптовані пости, хештеги та візуал для Instagram, TikTok та LinkedIn. Ваш персональний AI-маркетолог завжди під рукою.
            </p>
            <CtaButton onClick={() => navigate('/login')}>
              Створіть свій перший mist
            </CtaButton>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {['Безкоштовно', 'Без кредитної картки', 'Готово за хвилину'].map((t, i, arr) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="text-sm text-[#888]">{t}</span>
                  {i < arr.length - 1 && <span className="text-[#ccc]">·</span>}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-[#bbb] font-medium mr-1">Працює з</span>
              {PLATFORM_NAMES.map(name => (
                <PlatformIcon key={name} name={name} size={32} iconSize={15} rounded="lg" />
              ))}
            </div>
          </div>
          <MockCard />
        </div>
      </section>

      <section className="relative z-10 bg-white min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-12 py-16">
          <p className="text-center text-xs font-bold tracking-widest text-[#D63384] uppercase mb-2">Як це працює</p>
          <h2 className="text-center text-4xl font-extrabold tracking-tight mb-3">Три кроки до готового пакету</h2>
          <p className="text-center text-base text-[#888] mb-12 max-w-xl mx-auto leading-relaxed">
            Від посилання на відео до повного набору контенту для всіх платформ — без жодного зусилля з вашого боку
          </p>
          <div className="grid grid-cols-3 gap-5 max-w-3xl mx-auto">
            {STEPS.map(s => (
              <div key={s.num} className="rounded-3xl p-6 border border-black/[0.07] hover:-translate-y-1 transition-all hover:shadow-lg"
                style={{ background: '#FDFAF7' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-[#D63384] mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg,#fce4ec,#f48fb1)' }}>
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-center mb-2">{s.title}</h3>
                <p className="text-xs text-[#666] leading-relaxed text-center">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-12 py-16">
          <p className="text-center text-xs font-bold tracking-widest text-[#D63384] uppercase mb-2">Для кого</p>
          <h2 className="text-center text-4xl font-extrabold tracking-tight mb-3">Mist для кожного хто створює</h2>
          <p className="text-center text-base text-[#888] mb-12 max-w-xl mx-auto leading-relaxed">
            Незалежно від вашої ніші — ми допоможемо масштабувати контент без зайвих витрат часу та грошей
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
            {WHO_CARDS.map(w => (
              <div key={w.name} className="rounded-3xl p-6 border border-black/[0.07] hover:-translate-y-1 transition-all hover:shadow-md hover:border-[#D63384]/20"
                style={{ background: '#FDFAF7' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-[#D63384]"
                  style={{ background: 'rgba(232,121,154,0.12)' }}>
                  {w.icon}
                </div>
                <h3 className="text-sm font-bold mb-1.5">{w.name}</h3>
                <p className="text-xs text-[#888] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-12">
        <h2 className="text-5xl font-extrabold tracking-tighter bg-linear-to-br from-[#E8799A] to-[#D63384] bg-clip-text text-transparent mb-4 leading-tight">
          Ваш наступний пост<br />уже майже готовий
        </h2>
        <p className="text-base text-[#888] mb-8 max-w-md leading-relaxed">
          Приєднуйтесь до тисяч контент-мейкерів які вже економлять години щотижня разом з Mist
        </p>
        <CtaButton onClick={() => navigate('/login')}>
          Створіть свій перший mist
        </CtaButton>
        <div className="mt-4 text-sm text-[#bbb]">Безкоштовно · Без кредитної картки · Готово за хвилину</div>
      </section>

      <footer className="relative z-10 flex justify-between items-center px-12 py-5 border-t border-black/[0.07]">
        <div className="text-xl font-extrabold tracking-tight bg-linear-to-br from-[#E8799A] to-[#D63384] bg-clip-text text-transparent">
          mist
        </div>
        <div className="text-xs text-[#bbb]">© 2026 Mist · Всі права захищені</div>
      </footer>
    </div>
  );
};

export default LandingPage;