import { useState } from 'react';
import { Music2, ZoomIn, Download } from 'lucide-react';
import PlatformIcon from '../../../components/ui/PlatformIcon';
import PhotoModal, { downloadFile } from '../../../components/ui/PhotoModal';
import CopyButton from '../../../components/ui/CopyButton';
import { brand } from '../../../utils/theme';
import { formatDuration } from '../../../utils/format';

const PlatformCard = ({ platform }) => {
  const [modalSrc, setModalSrc] = useState(null);
  const [modalFilename, setModalFilename] = useState(null);

  const hashtags = platform.generatedHashtags
    ? platform.generatedHashtags.split(' ').filter(h => h.startsWith('#'))
    : [];

  const openModal = (url, filename) => { setModalSrc(url); setModalFilename(filename); };

  return (
    <>
      {modalSrc && (
        <PhotoModal
          src={modalSrc}
          onClose={() => { setModalSrc(null); setModalFilename(null); }}
          downloadFilename={modalFilename}
        />
      )}

      <div className="rounded-2xl overflow-hidden border border-white/80"
        style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(18px)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <PlatformIcon name={platform.platformName} size={28} iconSize={14} />
            <span className="text-sm font-bold text-[#1A1A1A]">{platform.platformName}</span>
            {platform.toneName && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-[#D63384]"
                style={{ background: brand.bgLight }}>
                {platform.toneName}
              </span>
            )}
          </div>
          <CopyButton text={`${platform.generatedText ?? ''}\n\n${platform.generatedHashtags ?? ''}`} label="Копіювати все" />
        </div>

        <div className="p-5 grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="col-span-2 rounded-xl p-4 border border-white/80"
            style={{ background: 'rgba(255,255,255,0.5)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest">Текст поста</p>
              <CopyButton text={platform.generatedText ?? ''} label="Копіювати" small />
            </div>
            <p className="text-xs text-[#1A1A1A] leading-relaxed mb-3">{platform.generatedText}</p>
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map(h => (
                  <span key={h} className="px-2 py-0.5 rounded-full text-xs font-medium text-[#D63384]"
                    style={{ background: brand.bgLight }}>{h}</span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl p-4 border border-white/80" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest mb-3">Фото</p>
            {platform.photos.length > 0 ? (
              <div className="flex gap-2.5 items-end flex-wrap">
                {platform.photos.map((photo, i) => {
                  const w = Math.max(Math.round((photo.width ?? 1080) / 15), 40);
                  const h = Math.max(Math.round((photo.height ?? 1080) / 15), 40);
                  const filename = `${photo.formatName ?? 'photo'}.jpg`;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="relative rounded-xl group overflow-hidden" style={{ width: w, height: h }}>
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(0,0,0,0.45)' }}>
                          <button onClick={() => openModal(photo.url, filename)}
                            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                            <ZoomIn size={11} color="white" />
                          </button>
                          <button onClick={() => downloadFile(photo.url, filename)}
                            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                            <Download size={11} color="white" />
                          </button>
                        </div>
                      </div>
                      <p className="text-center text-[#bbb] font-medium" style={{ fontSize: 9 }}>
                        {photo.formatName ?? `${photo.width}×${photo.height}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#ccc]">Фото не додавались</p>
            )}
          </div>

          <div className="rounded-xl p-4 border border-white/80" style={{ background: 'rgba(255,255,255,0.5)' }}>
            <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest mb-3">Трек</p>
            {platform.track ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg,#fffde7,#ffe082)' }}>
                  <Music2 size={14} className="text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A1A] truncate">{platform.track.title}</p>
                  <p className="text-xs text-[#aaa]">
                    {platform.track.authorName ?? 'Jamendo'}
                    {platform.track.durationSeconds ? ` · ${formatDuration(platform.track.durationSeconds)}` : ''}
                  </p>
                </div>
                {platform.track.previewUrl && (
                  <button
                    onClick={() => downloadFile(platform.track.previewUrl, `${platform.track.title}.mp3`)}
                    className="px-3 py-1.5 rounded-full border border-black/10 text-xs font-medium text-[#888] hover:text-[#D63384] hover:border-[#D63384]/20 transition-colors shrink-0">
                    Завантажити
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#ccc]">Трек не обирався</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlatformCard;