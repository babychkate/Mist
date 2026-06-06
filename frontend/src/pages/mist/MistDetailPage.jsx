import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Blobs from '../../components/ui/Blobs';
import PlatformCard from './components/PlatformCard';
import { platformConfig } from '../../components/ui/PlatformIcon';
import axiosInstance from '../../api/axiosInstance';
import JSZip from 'jszip';

const MistDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zipping, setZipping] = useState(false);
  const [activePlatformId, setActivePlatformId] = useState(null);

  const sanitize = (str) => str.replace(/[^\wа-яА-ЯіІїЇєЄ\s-]/g, '').trim().slice(0, 40);

  const handleDownloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      const summary = [
        `Назва відео: ${data.videoTitle}`,
        `YouTube: https://youtube.com/watch?v=${data.videoYoutubeId}`,
        `Дата генерації: ${data.createdAt}`,
        `Платформи: ${data.platforms.map(p => p.platformName).join(', ')}`,
      ].join('\n');
      zip.file('summary.txt', summary);

      await Promise.all(data.platforms.map(async (platform) => {
        const folderName = sanitize(platform.platformName.toLowerCase());
        zip.file(`${folderName}/text/post.txt`, platform.generatedText ?? '');
        zip.file(`${folderName}/text/hashtags.txt`, platform.generatedHashtags ?? '');

        await Promise.all([
          ...platform.photos.map(async (photo) => {
            try {
              const res = await fetch(photo.url);
              const blob = await res.blob();
              const filename = sanitize(photo.formatName ?? `photo_${photo.width}x${photo.height}`);
              zip.file(`${folderName}/photos/${filename}.jpg`, blob);
            } catch { /* пропускаємо */ }
          }),
          (async () => {
            if (!platform.track?.apiId) return;
            try {
              const res = await axiosInstance.get(`/musicfetch/fresh-url?trackId=${platform.track.apiId}`, { responseType: 'blob' });
              const trackName = sanitize(platform.track.title ?? 'track');
              zip.file(`${folderName}/music/${trackName}.mp3`, res.data);
            } catch {
              const trackInfo = [`Назва: ${platform.track.title}`, `Автор: ${platform.track.authorName ?? ''}`].join('\n');
              zip.file(`${folderName}/music/track.txt`, trackInfo);
            }
          })(),
        ]);
      }));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mist_${sanitize(data.videoTitle)}_${data.createdAt}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setZipping(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get(`/mist/${id}`);
        setData(res.data);
        if (res.data.platforms?.length > 0) {
          setActivePlatformId(res.data.platforms[0].generationPlatformId);
        }
      } catch (err) {
        console.error(err);
        navigate('/history');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF7' }}>
      <p className="text-sm text-[#bbb]">Завантаження...</p>
    </div>
  );

  if (!data) return null;

  const activePlatform = data.platforms.find(p => p.generationPlatformId === activePlatformId);
  const totalPhotos = data.platforms.reduce((acc, p) => acc + p.photos.length, 0);

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF7', color: '#1A1A1A' }}>
      <Blobs />
      <Navbar variant="app" />

      <div className="relative z-10 max-w-4xl mx-auto px-10 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <button onClick={() => navigate('/history')}
              className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#1A1A1A] mb-2 transition-colors border-none bg-transparent cursor-pointer">
              ← Назад до історії
            </button>
            <p className="text-xl font-extrabold tracking-tight mb-1">{data.videoTitle}</p>
            <p className="text-xs text-[#bbb]">
              Збережено {data.createdAt} · {data.platforms.length} {data.platforms.length === 1 ? 'платформа' : 'платформи'} · {totalPhotos} {totalPhotos === 1 ? 'формат' : 'формати'} фото
            </p>
          </div>
          <button onClick={handleDownloadZip} disabled={zipping}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold shrink-0 hover:-translate-y-px transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: '#1A1A1A' }}>
            <Download size={14} />
            {zipping ? 'Завантажується...' : 'Завантажити ZIP'}
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/80 mb-6"
          style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(16px)', boxShadow: '0 3px 12px rgba(0,0,0,0.04)' }}>
          <div className="w-20 h-12 rounded-lg shrink-0 relative flex items-center justify-center overflow-hidden">
            {data.videoThumbnailUrl
              ? <img src={data.videoThumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              : <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#1a1a2e,#0f3460)' }} />
            }
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.4),transparent)' }} />
            <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center relative z-10"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <svg width="7" height="7" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold mb-0.5">{data.videoTitle}</p>
            <a href={`https://youtube.com/watch?v=${data.videoYoutubeId}`}
              target="_blank" rel="noreferrer"
              className="text-xs text-[#aaa] hover:text-[#D63384] transition-colors">
              youtube.com/watch?v={data.videoYoutubeId}
            </a>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {data.platforms.map(p => {
            const cfg = platformConfig[p.platformName];
            return (
              <button key={p.generationPlatformId}
                onClick={() => setActivePlatformId(p.generationPlatformId)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all"
                style={activePlatformId === p.generationPlatformId
                  ? { background: 'rgba(232,121,154,0.10)', border: '1px solid rgba(214,51,132,0.3)', color: '#D63384', fontWeight: 600 }
                  : { background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(0,0,0,0.08)', color: '#888' }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg?.bg ?? '#888' }} />
                {p.platformName}
              </button>
            );
          })}
        </div>

        {activePlatform && <PlatformCard platform={activePlatform} />}
      </div>
    </div>
  );
};

export default MistDetailPage;