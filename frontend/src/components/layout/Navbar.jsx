import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { brand } from '../../utils/theme';

const NAV_STYLE = {
  height: 58,
  background: brand.glass,
  backdropFilter: brand.blur,
};

const Navbar = ({ variant = 'app' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const userName = user?.userName || user?.email?.split('@')[0] || 'К';
  const firstLetter = userName.charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl ?? null;

  const isDashboard = location.pathname === '/dashboard';
  const isHistory = location.pathname === '/history' || location.pathname.startsWith('/mist');

  const logo = (
    <div
      onClick={() => variant !== 'landing' && navigate('/dashboard')}
      className={`font-extrabold tracking-tight bg-linear-to-br from-[#E8799A] to-[#D63384] bg-clip-text text-transparent ${variant === 'landing' ? 'text-3xl' : 'text-xl cursor-pointer'}`}>
      mist
    </div>
  );

  const avatar = (
    <div
      onClick={() => navigate('/profile')}
      className="w-8 h-8 rounded-full overflow-hidden cursor-pointer shrink-0"
      style={{ background: brand.gradient }}>
      {avatarUrl
        ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
            {firstLetter}
          </div>
      }
    </div>
  );

  if (variant === 'landing') {
    return (
      <nav className="flex justify-between items-center px-12 py-4 sticky top-0 z-50 border-b border-black/[0.07]"
        style={{ background: brand.glassNav, backdropFilter: brand.blurNav }}>
        {logo}
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full border border-black/0.18 text-sm font-medium hover:bg-black/0.04 transition-colors">
            Увійти
          </button>
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#333] transition-colors">
            Почати
          </button>
        </div>
      </nav>
    );
  }

  if (variant === 'wizard') {
    return (
      <nav className="flex items-center justify-between px-10 sticky top-0 z-50 border-b border-white/85"
        style={NAV_STYLE}>
        {logo}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="px-4 py-1.5 rounded-full border border-black/0.12 text-sm text-[#888] hover:bg-black/0.04 transition-colors">
            Скасувати
          </button>
          {avatar}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-10 sticky top-0 z-50 border-b border-white/85"
      style={NAV_STYLE}>
      {logo}
      <div className="flex items-center gap-1">
        {[
          { label: 'Дашборд', path: '/dashboard', active: isDashboard },
          { label: 'Історія', path: '/history', active: isHistory },
        ].map(({ label, path, active }) => (
          <button key={path} onClick={() => navigate(path)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={active
              ? { background: brand.bgLight, color: '#D63384', fontWeight: 600 }
              : { color: '#888' }}>
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/wizard')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:-translate-y-px"
          style={{ background: brand.gradient, boxShadow: brand.shadow }}>
          <Plus size={14} /> Новий mist
        </button>
        {avatar}
      </div>
    </nav>
  );
};

export default Navbar;