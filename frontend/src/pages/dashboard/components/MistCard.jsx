import PlatformIcon from '../../../components/ui/PlatformIcon';
import { thumbGradients } from '../../../utils/theme';

const MistCard = ({ mist, onClick, index }) => {
  const bg = mist.videoThumbnailUrl ? null : thumbGradients[index % thumbGradients.length];

  return (
    <div onClick={onClick}
      className="rounded-2xl overflow-hidden border border-white/70 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-[#D63384]/20"
      style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(16px)', boxShadow: '0 3px 12px rgba(0,0,0,0.04)' }}>
      <div className="w-full relative flex items-center justify-center" style={{ height: 140 }}>
        {mist.videoThumbnailUrl
          ? <img src={mist.videoThumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          : <div className="absolute inset-0" style={{ background: bg }} />
        }
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,.55),transparent 60%)' }} />
        <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center relative z-10"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-[#1A1A1A] leading-snug mb-1 line-clamp-2">{mist.videoTitle}</p>
        <p className="text-xs text-[#ccc] mb-1.5">{mist.createdAt}</p>
        <div className="flex gap-1 mb-1.5">
          {mist.platforms.map(p => (
            <PlatformIcon key={p.platformId} name={p.platformName} size={16} iconSize={9} rounded="sm" />
          ))}
        </div>
        {mist.tracks.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-black/5 pt-1.5">
            {mist.tracks.map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[#aaa]">
                <div className="w-1 h-1 rounded-full bg-yellow-400 shrink-0" />
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MistCard;