import { useState, useRef, useEffect } from 'react';
import { Music2, Search, Play, Pause, Check } from 'lucide-react';
import { brand } from '../../../utils/theme';
import { searchMusicRequest } from '../../../api/music.api';

// ——— Один рядок треку ———
const TrackRow = ({ track, isSelected, onSelect, playingId, onTogglePlay }) => {
  const isPlaying = playingId === track.apiId;

  return (
    <button
      onClick={() => onSelect(track)}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left w-full"
      style={
        isSelected
          ? { background: 'rgba(245,200,66,0.10)', border: '1px solid rgba(245,200,66,0.4)' }
          : { background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.07)' }
      }>

      {/* Play/Pause кнопка */}
      <button
        onClick={e => { e.stopPropagation(); onTogglePlay(track); }}
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all hover:scale-105"
        style={{ background: isPlaying ? brand.gradient : 'linear-gradient(135deg,#fffde7,#ffe082)' }}>
        {isPlaying
          ? <Pause size={11} color="white" fill="white" />
          : <Play size={11} className="text-yellow-600" fill="#ca8a04" />
        }
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#1A1A1A] truncate">{track.title}</p>
        <p className="text-xs text-[#aaa] truncate">{track.authorName}{track.genre ? ` · ${track.genre}` : ''}</p>
      </div>

      <span className="text-xs text-[#bbb] shrink-0">{track.duration}</span>

      {isSelected && (
        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
          style={{ background: brand.gradient }}>
          <Check size={8} strokeWidth={3} color="white" />
        </div>
      )}
    </button>
  );
};

// ——— MusicSection ———
const MusicSection = ({ selectedTrack, onTrackChange }) => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState(null);

  const audioRef = useRef(null);

  // Завантажуємо дефолтні треки при монтуванні
  useEffect(() => {
    fetchTracks('');
  }, []);

  // Зупиняємо аудіо при анмаунті
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchTracks = async (q) => {
    setLoading(true);
    setError('');
    try {
      const res = await searchMusicRequest(q);
      setTracks(res.data);
    } catch {
      setError('Не вдалось завантажити треки');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchTracks(query);

  const handleTogglePlay = (track) => {
    if (playingId === track.apiId) {
      // Пауза
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      // Зупиняємо попередній
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Запускаємо новий
      const audio = new Audio(track.previewUrl);
      audio.play().catch(() => {});
      audio.onended = () => setPlayingId(null);
      audioRef.current = audio;
      setPlayingId(track.apiId);
    }
  };

  const handleSelect = (track) => {
    onTrackChange(track);
  };

  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3">Музичний трек</p>

      {/* Пошук */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-black/9"
          style={{ background: 'rgba(255,255,255,0.6)' }}>
          <Search size={12} className="text-[#ccc] shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Пошук треку..."
            className="flex-1 outline-none bg-transparent text-xs placeholder-[#ccc]"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-colors disabled:opacity-50"
          style={{ background: '#1A1A1A' }}>
          Знайти
        </button>
      </div>

      {/* Список треків */}
      <div className="rounded-xl border border-black/9 overflow-hidden" style={{ background: 'rgba(255,255,255,0.4)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-[#bbb] animate-pulse">Завантаження треків...</p>
          </div>
        ) : error ? (
          <p className="text-xs text-red-400 text-center py-4">{error}</p>
        ) : tracks.length === 0 ? (
          <p className="text-xs text-[#ccc] text-center py-4">Нічого не знайдено</p>
        ) : (
          <div className="flex flex-col gap-1.5 p-3 max-h-52 overflow-y-auto">
            {tracks.map(track => (
              <TrackRow
                key={track.apiId}
                track={track}
                isSelected={selectedTrack?.apiId === track.apiId}
                onSelect={handleSelect}
                playingId={playingId}
                onTogglePlay={handleTogglePlay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Обраний трек */}
      {selectedTrack && (
        <div className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
          style={{ background: 'rgba(245,200,66,0.06)', border: '1px solid rgba(245,200,66,0.3)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#fffde7,#ffe082)' }}>
            <Music2 size={13} className="text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1A1A1A] truncate">{selectedTrack.title}</p>
            <p className="text-xs text-[#aaa]">{ selectedTrack.authorName} · {selectedTrack.duration}</p>
          </div>
          <Check size={12} className="text-yellow-600 shrink-0" />
        </div>
      )}
    </div>
  );
};

export default MusicSection;
