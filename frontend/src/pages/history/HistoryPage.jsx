import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { brand } from '../../utils/theme';
import Navbar from '../../components/layout/Navbar';
import Blobs from '../../components/ui/Blobs';
import HistoryCard from './components/HistoryCard';
import { platformConfig } from '../../components/ui/PlatformIcon';
import axiosInstance from '../../api/axiosInstance';

const PLATFORM_FILTERS = [
  { id: null, label: 'Всі' },
  ...Object.entries(platformConfig).map(([name, cfg]) => ({
    id: cfg.id,
    label: name,
    dot: cfg.bg,
  })),
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const params = {};
        if (activeFilter) params.platformId = activeFilter;
        if (debouncedSearch) params.search = debouncedSearch;
        const res = await axiosInstance.get('/history', { params });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [activeFilter, debouncedSearch]);

  const months = [...new Set(data.map(m => m.month))];

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF7', color: '#1A1A1A' }}>
      <Blobs />
      <Navbar variant="app" />

      <div className="relative z-10 px-10 py-6">
        <p className="text-xl font-extrabold tracking-tight mb-0.5">Історія</p>
        <p className="text-xs text-[#bbb] mb-5">Всі ваші mists за весь час</p>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {PLATFORM_FILTERS.map(f => (
            <button key={String(f.id)} onClick={() => setActiveFilter(f.id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-medium transition-all"
              style={activeFilter === f.id
                ? { background: brand.bgLight, border: brand.border, color: '#D63384', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.09)', color: '#888' }
              }>
              {f.dot && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: f.dot }} />}
              {f.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.5)', border: brand.borderSubtle }}>
            <Search size={13} className="text-[#ccc] shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Пошук по назві..."
              className="outline-none bg-transparent text-xs text-[#1A1A1A] placeholder-[#ccc] w-40"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="rounded-[18px] border border-white/80 animate-pulse"
                style={{ height: 180, background: 'rgba(255,255,255,0.45)' }} />
            ))}
          </div>
        ) : months.length === 0 ? (
          <p className="text-sm text-[#bbb] text-center mt-20">Нічого не знайдено</p>
        ) : (
          months.map(month => (
            <div key={month} className="mb-8">
              <p className="text-xs font-bold text-[#bbb] uppercase tracking-widest mb-3">{month}</p>
              <div className="grid grid-cols-4 gap-3">
                {data.filter(m => m.month === month).map((m, i) => (
                  <HistoryCard key={m.generationId} mist={m} index={i}
                    onClick={() => navigate(`/mist/${m.generationId}`)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;