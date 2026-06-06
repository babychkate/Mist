import { useState } from 'react';
import { Check } from 'lucide-react';
import { brand } from '../../utils/theme';
import { fetchVideoRequest } from '../../api/video.api';
import { platformConfig } from '../../components/ui/PlatformIcon';
import { formatViewCount } from '../../utils/format';

const Step1 = ({ selected, togglePlatform, platforms, onNext, onVideoLoaded }) => {
  const [url, setUrl] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoad = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setVideo(null);
    try {
      const res = await fetchVideoRequest(url.trim());
      setVideo(res.data);
      onVideoLoaded(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Не вдалось завантажити відео. Перевірте посилання.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-10 py-10">
      <p className="text-2xl font-extrabold tracking-tight mb-1.5">Новий mist</p>
      <p className="text-sm text-[#aaa] mb-8">Вставте посилання на YouTube відео і оберіть платформи</p>

      <div className="rounded-2xl p-6 border border-white/80 mb-4"
        style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)', boxShadow: '0 6px 24px rgba(0,0,0,0.05)' }}>
        <p className="text-xs font-semibold text-[#666] mb-2 tracking-wide">YouTube посилання</p>
        <div className="flex gap-2.5">
          <input
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              if (!e.target.value.trim()) { setVideo(null); setError(''); onVideoLoaded(null); }
            }}
            onKeyDown={e => e.key === 'Enter' && handleLoad()}
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none placeholder-[#ccc]"
            style={{ background: 'rgba(255,255,255,0.7)', border: brand.borderSubtle }}
          />
          <button
            onClick={handleLoad}
            disabled={!url.trim() || loading}
            className="px-5 py-3 rounded-xl text-white text-sm font-semibold shrink-0 hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: brand.gradient, boxShadow: brand.shadow }}>
            {loading ? 'Завантаження...' : 'Завантажити'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {video && (
        <div className="rounded-2xl p-4 border border-white/80 mb-4 flex gap-4 items-center"
          style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)', boxShadow: '0 6px 24px rgba(0,0,0,0.05)' }}>
          <div className="w-36 h-20 rounded-xl shrink-0 relative overflow-hidden">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.4),transparent)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.18)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-1 leading-snug">{video.title}</p>
            <p className="text-xs text-[#aaa] mb-2">
              {video.channelName}
              {video.viewCount ? ` · ${formatViewCount(video.viewCount)} переглядів` : ''}
              {video.duration ? ` · ${video.duration}` : ''}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {video.tags.map(t => (
                <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium text-[#D63384]"
                  style={{ background: brand.bgLight, border: brand.border }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Відео знайдено
          </div>
        </div>
      )}

      <div className="rounded-2xl p-6 border border-white/80 mb-6"
        style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(20px)', boxShadow: '0 6px 24px rgba(0,0,0,0.05)' }}>
        <p className="text-xs font-semibold text-[#666] mb-4 tracking-wide">Оберіть платформи для генерації</p>
        <div className="grid grid-cols-5 gap-2.5">
          {platforms.map(p => {
            const meta = platformConfig[p.platformName] ?? { icon: () => null, bg: '#999' };
            const isSelected = selected.has(p.platformId);
            return (
              <button key={p.platformId} onClick={() => togglePlatform(p.platformId)}
                className="relative rounded-2xl py-3.5 px-3 flex flex-col items-center gap-2 transition-all hover:-translate-y-px"
                style={{
                  border: isSelected ? '1.5px solid #D63384' : '1.5px solid rgba(0,0,0,0.08)',
                  background: isSelected ? brand.bgLight : 'rgba(255,255,255,0.5)',
                }}>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: brand.gradient }}>
                    <Check size={8} strokeWidth={3} color="white" />
                  </div>
                )}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: meta.bg }}>
                  {meta.icon(18)}
                </div>
                <span className="text-xs font-semibold text-[#444]">{p.platformName}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#ccc]">
          Обрано платформ: <span className="text-[#D63384] font-semibold">{selected.size}</span>
        </p>
        <button
          onClick={onNext}
          disabled={selected.size === 0 || !video}
          className="px-8 py-3 rounded-full text-white text-sm font-semibold hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: brand.gradient, boxShadow: brand.shadow }}>
          Далі
        </button>
      </div>
    </div>
  );
};

export default Step1;