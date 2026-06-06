import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';
import { brand } from '../../utils/theme';

const downloadFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

const PhotoModal = ({ src, onClose, downloadFilename = null }) =>
  createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="relative" onClick={e => e.stopPropagation()}>
        <img src={src} alt="preview"
          className="rounded-2xl object-contain shadow-2xl"
          style={{ maxWidth: '70vw', maxHeight: '70vh' }} />
        <button onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
          <X size={14} color="white" />
        </button>
        {downloadFilename && (
          <button
            onClick={e => { e.stopPropagation(); downloadFile(src, downloadFilename); }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all"
            style={{ background: brand.gradient, boxShadow: brand.shadow }}>
            <Download size={13} />
            Зберегти фото
          </button>
        )}
      </div>
    </div>,
    document.body
  );

export { downloadFile };
export default PhotoModal;