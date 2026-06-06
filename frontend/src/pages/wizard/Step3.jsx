import { useState } from 'react';
import { Music2, Pencil } from 'lucide-react';
import { brand } from '../../utils/theme';
import { platformConfig } from '../../components/ui/PlatformIcon';
import PhotoModal from '../../components/ui/PhotoModal';
import CopyButton from '../../components/ui/CopyButton';
import ResultPhoto from './components/ResultPhoto';
import MusicSection from './components/MusicSection';

const Step3 = ({ platforms, selected, results, setResults, video, onBack, onSave, saving }) => {
  const selectedPlatforms = platforms.filter(p => selected.has(p.platformId));
  const [activePlatformId, setActivePlatformId] = useState(selectedPlatforms[0]?.platformId);
  const [editingText, setEditingText] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftHashtags, setDraftHashtags] = useState('');
  const [changingTrack, setChangingTrack] = useState(false);

  const platform = selectedPlatforms.find(p => p.platformId === activePlatformId);
  const result = results[activePlatformId] ?? {};
  const meta = platformConfig[platform?.platformName] ?? { bg: '#999', icon: () => null };

  const handlePlatformChange = (pid) => {
    setActivePlatformId(pid);
    setEditingText(false);
    setChangingTrack(false);
  };

  const handleStartEditText = () => {
    setDraftText(result.text ?? '');
    setDraftHashtags(result.hashtags ?? '');
    setEditingText(true);
  };

  const handleSaveText = () => {
    setResults(prev => ({
      ...prev,
      [activePlatformId]: { ...prev[activePlatformId], text: draftText, hashtags: draftHashtags }
    }));
    setEditingText(false);
  };

  const handleRemovePhoto = (formatId, url) => {
  const currentPhotos = results[activePlatformId]?.photos ?? [];
  if (currentPhotos.length <= 1) return;
  setResults(prev => ({
    ...prev,
    [activePlatformId]: {
      ...prev[activePlatformId],
      photos: prev[activePlatformId].photos.filter(p => !(p.formatId === formatId && p.url === url))
    }
  }));
};

  const handleTrackChange = (track) => {
    setResults(prev => ({ ...prev, [activePlatformId]: { ...prev[activePlatformId], track } }));
    setChangingTrack(false);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-10 py-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="text-xl font-extrabold tracking-tight mb-1">Огляд генерації</p>
          <p className="text-xs text-[#bbb]">
            {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'платформа' : 'платформи'} · Перевірте результат перед збереженням
          </p>
        </div>
        <button onClick={onSave} disabled={saving}
          className="px-6 py-2.5 rounded-full text-white text-sm font-semibold shrink-0 hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: brand.gradient, boxShadow: brand.shadow }}>
          {saving ? 'Зберігається...' : 'Зберегти mist'}
        </button>
      </div>

      {video && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/80 mb-6"
          style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(16px)', boxShadow: '0 3px 12px rgba(0,0,0,0.04)' }}>
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt={video.title}
            className="w-16 h-10 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1A1A1A] truncate">{video.title}</p>
            <p className="text-xs text-[#aaa]">{video.channelName}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5 flex-wrap">
        {selectedPlatforms.map(p => {
          const m = platformConfig[p.platformName] ?? { bg: '#999' };
          return (
            <button key={p.platformId}
              onClick={() => handlePlatformChange(p.platformId)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all"
              style={activePlatformId === p.platformId
                ? { background: brand.bgLight, border: '1px solid rgba(214,51,132,0.3)', color: '#D63384', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(0,0,0,0.08)', color: '#888' }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: m.bg }} />
              {p.platformName}
            </button>
          );
        })}
      </div>

      {platform && (
        <div className="rounded-2xl overflow-hidden border border-white/80"
          style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(18px)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center px-5 py-4 border-b border-black/5 gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: meta.bg }}>
              {meta.icon(14)}
            </div>
            <span className="text-sm font-bold text-[#1A1A1A]">{platform.platformName}</span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="rounded-xl p-4 border border-white/80" style={{ background: 'rgba(255,255,255,0.5)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest">Текст поста</p>
                <div className="flex items-center gap-2">
                  {!editingText ? (
                    <>
                      <CopyButton text={`${result.text ?? ''}\n\n${result.hashtags ?? ''}`} />
                      <button onClick={handleStartEditText}
                        className="flex items-center gap-1 text-xs text-[#D63384] font-medium hover:underline">
                        <Pencil size={10} /> Редагувати
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingText(false)}
                        className="text-xs text-[#888] font-medium hover:underline">Скасувати</button>
                      <button onClick={handleSaveText}
                        className="text-xs text-white font-semibold px-3 py-1 rounded-full"
                        style={{ background: brand.gradient }}>Зберегти</button>
                    </div>
                  )}
                </div>
              </div>
              {editingText ? (
                <>
                  <textarea value={draftText} onChange={e => setDraftText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-black/9 text-xs outline-none resize-none mb-2"
                    style={{ height: 110, background: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }} />
                  <textarea value={draftHashtags} onChange={e => setDraftHashtags(e.target.value)}
                    placeholder="#хештеги через пробіл..."
                    className="w-full px-3 py-2 rounded-xl border border-black/9] text-xs outline-none resize-none"
                    style={{ height: 48, background: 'rgba(255,255,255,0.8)', color: '#D63384' }} />
                </>
              ) : (
                <>
                  <p className="text-xs text-[#1A1A1A] leading-relaxed mb-3">{result.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.hashtags?.split(' ').filter(Boolean).map(h => (
                      <span key={h} className="px-2 py-0.5 rounded-full text-xs font-medium text-[#D63384]"
                        style={{ background: brand.bgLight }}>{h}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="rounded-xl p-4 border border-white/80" style={{ background: 'rgba(255,255,255,0.5)' }}>
                <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest mb-3">Фото</p>
                {result.photos?.length > 0 ? (
                  <div className="flex gap-2.5 flex-wrap items-end">
                    {result.photos.map((photo, i) => (
                      <ResultPhoto
                        key={i}
                        photo={photo}
                        maxSize={100}
                        onRemove={handleRemovePhoto}
                        isLast={result.photos.length === 1}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#ccc]">Фото не обрано</p>
                )}
              </div>

              <div className="rounded-xl p-4 border border-white/80" style={{ background: 'rgba(255,255,255,0.5)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest">Трек</p>
                  {!changingTrack && (
                    <button onClick={() => setChangingTrack(true)}
                      className="flex items-center gap-1 text-xs text-[#D63384] font-medium hover:underline">
                      <Pencil size={10} /> Змінити
                    </button>
                  )}
                </div>
                {changingTrack ? (
                  <>
                    <MusicSection selectedTrack={result.track ?? null} onTrackChange={handleTrackChange} />
                    <button onClick={() => setChangingTrack(false)}
                      className="text-xs text-[#888] font-medium hover:underline mt-1">Скасувати</button>
                  </>
                ) : result.track ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg,#fffde7,#ffe082)' }}>
                      <Music2 size={14} className="text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{result.track.title}</p>
                      <p className="text-xs text-[#aaa]">Jamendo · {result.track.duration}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#ccc]">Трек не обрано</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3;