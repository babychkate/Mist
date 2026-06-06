import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import Blobs from '../../components/ui/Blobs';
import MistCard from './components/MistCard';
import Calendar from './components/Calendar';
import axiosInstance from '../../api/axiosInstance';
import { brand } from '../../utils/theme';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1);
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calLoading, setCalLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const n = new Date();
        const res = await axiosInstance.get('/dashboard', {
          params: { month: n.getMonth() + 1, year: n.getFullYear() }
        });
        setData(res.data);
        setCalendarDays(res.data.activeCalendarDays ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const fetchCalendar = async (month, year) => {
    try {
      setCalLoading(true);
      const res = await axiosInstance.get('/dashboard', { params: { month, year } });
      setCalendarDays(res.data.activeCalendarDays ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setCalLoading(false);
    }
  };

  const handlePrevMonth = () => {
    const newMonth = calMonth === 1 ? 12 : calMonth - 1;
    const newYear = calMonth === 1 ? calYear - 1 : calYear;
    setCalMonth(newMonth);
    setCalYear(newYear);
    setCalendarDays([]);
    fetchCalendar(newMonth, newYear);
  };

  const handleNextMonth = () => {
    const newMonth = calMonth === 12 ? 1 : calMonth + 1;
    const newYear = calMonth === 12 ? calYear + 1 : calYear;
    setCalMonth(newMonth);
    setCalYear(newYear);
    setCalendarDays([]);
    fetchCalendar(newMonth, newYear);
  };

  const userName = user?.userName || user?.email?.split('@')[0] || 'Користувач';

  const STATS = [
    { val: loading ? '—' : data?.totalGenerations ?? 0, label: 'Генерацій' },
    { val: loading ? '—' : data?.totalVideos ?? 0, label: 'Відео оброблено' },
    { val: loading ? '—' : data?.activeDays ?? 0, label: 'Днів активності' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF7', color: '#1A1A1A' }}>
      <Blobs />
      <Navbar variant="app" />

      <div className="relative z-10 px-10 py-6">
        <p className="text-xl font-extrabold tracking-tight mb-0.5">Вітаю, {userName}!</p>
        <p className="text-xs text-[#bbb] mb-5">Ваша статистика за весь час</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl px-4 py-3 border border-white/75"
              style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(16px)', boxShadow: '0 3px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-2xl font-extrabold tracking-tight leading-none">{s.val}</div>
              <div className="text-xs text-[#bbb] mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '3fr 1fr' }}>
          <div>
            <p className="text-sm font-bold mb-3">Останні mists</p>
            {loading ? (
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="rounded-2xl border border-white/70 animate-pulse"
                    style={{ height: 180, background: 'rgba(255,255,255,0.35)' }} />
                ))}
              </div>
            ) : data?.recentMists?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {data.recentMists.map((m, i) => (
                  <MistCard key={m.generationId} mist={m} index={i}
                    onClick={() => navigate(`/mist/${m.generationId}`)} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/70 flex items-center justify-center mb-3"
                style={{ height: 180, background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(16px)' }}>
                <p className="text-sm text-[#ccc]">Ще немає жодного mist</p>
              </div>
            )}
            <button
              onClick={() => navigate('/history')}
              className="w-full py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:-translate-y-px"
              style={{ background: brand.gradient, boxShadow: brand.shadow }}>
              Переглянути всі mists
            </button>
          </div>

          <div>
            <p className="text-sm font-bold mb-3">Календар активності</p>
            <Calendar
              month={calMonth}
              year={calYear}
              activeDays={calendarDays}
              loading={calLoading}
              onPrev={handlePrevMonth}
              onNext={handleNextMonth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;