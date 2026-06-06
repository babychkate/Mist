import { useState } from 'react';
import { ZoomIn, Download, X } from 'lucide-react';
import PhotoModal, { downloadFile } from '../../../components/ui/PhotoModal';

const ResultPhoto = ({ photo, onRemove, maxSize = 120, isLast = false}) => {
  const [modalSrc, setModalSrc] = useState(null);

  return (
    <>
      {modalSrc && <PhotoModal src={modalSrc} onClose={() => setModalSrc(null)} />}
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative group rounded-xl overflow-hidden cursor-pointer"
          style={{
            width: Math.min(Math.round(photo.width / 10), maxSize),
            height: Math.min(Math.round(photo.height / 10), maxSize),
            minWidth: 56, minHeight: 56,
          }}>
          <img src={photo.url} alt={photo.formatName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.45)' }}>
            <button onClick={() => setModalSrc(photo.url)}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
              <ZoomIn size={11} color="white" />
            </button>
            <button onClick={() => downloadFile(photo.url, `${photo.formatName || 'photo'}.jpg`)}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
              <Download size={11} color="white" />
            </button>
            <button
              onClick={() => !isLast && onRemove(photo.formatId, photo.url)}
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-red-500/70 transition-colors"
              style={{ opacity: isLast ? 0.3 : 1, cursor: isLast ? 'not-allowed' : 'pointer' }}>
              <X size={11} color="white" />
            </button>
          </div>
        </div>
        <p className="text-xs text-[#bbb] font-medium" style={{ fontSize: 10 }}>{photo.formatName}</p>
        <p className="text-xs text-[#ccc]" style={{ fontSize: 10 }}>{photo.width}×{photo.height}</p>
      </div>
    </>
  );
};

export default ResultPhoto;