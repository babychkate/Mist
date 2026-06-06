import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, Check, Plus, Download } from 'lucide-react';
import { brand } from '../../../utils/theme';
import { generateImageRequest } from '../../../api/image.api';
import PhotoModal, { downloadFile } from '../../../components/ui/PhotoModal';

// ——— Хелпер завантаження base64 ———
const downloadBase64Image = (src, index) => downloadFile(src, `ai-image-${index + 1}.jpg`);


// ——— Фото-квадратик ———
const PhotoThumb = ({ src, isSelected, onToggle, onZoom, onRemove, onDownload, size = 140 }) => (
  <div className="relative group cursor-pointer shrink-0"
    style={{ width: size, height: size }}
    onClick={() => onToggle(src)}>
    <img src={src} alt=""
      className="w-full h-full object-cover rounded-xl transition-all"
      style={{
        outline: isSelected ? '2.5px solid #D63384' : '2.5px solid transparent',
        outlineOffset: 2,
      }} />

    {/* ZoomIn — правий верхній */}
    <button onClick={e => { e.stopPropagation(); onZoom(src); }}
      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <ZoomIn size={11} color="white" />
    </button>

    {/* Remove — лівий верхній */}
    {onRemove && (
      <button onClick={e => { e.stopPropagation(); onRemove(src); }}
        className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <X size={11} color="white" />
      </button>
    )}

    {/* Download — лівий нижній, тільки для AI */}
    {onDownload && (
      <button onClick={e => { e.stopPropagation(); onDownload(); }}
        className="absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Download size={11} color="white" />
      </button>
    )}

    {isSelected && (
      <div className="absolute inset-0 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(214,51,132,0.22)' }}>
        <Check size={20} color="white" strokeWidth={3} />
      </div>
    )}
  </div>
);

const PhotoSection = ({
  video,
  selectedPhotos,
  onTogglePhoto,
  uploadedPhotos,
  onUploadedPhotosChange,
  aiImages,
  onAiImagesChange,
}) => {
  const [tab, setTab] = useState(0);
  const [modalSrc, setModalSrc] = useState(null);
  const [modalIsAi, setModalIsAi] = useState(false);
  const fileInputRef = useRef(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const youtubeId = video?.youtubeId;
  const thumbnailSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    onUploadedPhotosChange([...uploadedPhotos, ...urls]);
  };

  const handleRemoveUploaded = (url) => {
    onUploadedPhotosChange(uploadedPhotos.filter(u => u !== url));
    if (selectedPhotos.includes(url)) onTogglePhoto(url);
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError('');
    try {
      const res = await generateImageRequest(aiPrompt.trim());
      onAiImagesChange([res.data.imageUrl, ...aiImages]);
    } catch {
      setAiError('Не вдалось згенерувати. Спробуйте ще раз.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleRemoveAiImage = (url) => {
    onAiImagesChange(aiImages.filter(u => u !== url));
    if (selectedPhotos.includes(url)) onTogglePhoto(url);
  };

  const openModal = (src, isAi = false) => {
    setModalSrc(src);
    setModalIsAi(isAi);
  };

  const tabs = ['YouTube thumbnail', 'Завантажити', 'AI генерація'];

  return (
    <>
      {modalSrc && (
        <PhotoModal
          src={modalSrc}
          onClose={() => { setModalSrc(null); setModalIsAi(false); }}
          onDownload={modalIsAi
            ? () => downloadBase64Image(modalSrc, aiImages.indexOf(modalSrc))
            : null}
        />
      )}

      <div className="mb-5">
        <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3">Фото</p>

        <div className="flex border border-black/9 rounded-xl overflow-hidden mb-3">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="flex-1 py-2 text-xs font-medium transition-all border-r border-black/8 last:border-r-0"
              style={tab === i
                ? { background: 'rgba(232,121,154,0.10)', color: '#D63384', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.5)', color: '#888' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-black/9 p-4" style={{ background: 'rgba(255,255,255,0.4)' }}>

          {/* Tab 0 — YouTube thumbnail */}
          {tab === 0 && (
            <>
              {thumbnailSrc ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[#bbb] mb-1">Thumbnail з YouTube — можна обрати або пропустити</p>
                  <PhotoThumb
                    src={thumbnailSrc}
                    isSelected={selectedPhotos.includes(thumbnailSrc)}
                    onToggle={onTogglePhoto}
                    onZoom={(src) => openModal(src, false)}
                    size={140}
                  />
                </div>
              ) : (
                <p className="text-xs text-[#ccc] text-center py-3">Спочатку завантажте відео на кроці 1</p>
              )}
            </>
          )}

          {/* Tab 1 — Завантажити */}
          {tab === 1 && (
            <>
              <input type="file" accept="image/*" multiple ref={fileInputRef}
                onChange={handleFileChange} className="hidden" />
              <div className="flex gap-2.5 flex-wrap">
                {uploadedPhotos.map((url, i) => (
                  <PhotoThumb key={i}
                    src={url}
                    isSelected={selectedPhotos.includes(url)}
                    onToggle={onTogglePhoto}
                    onZoom={(src) => openModal(src, false)}
                    onRemove={handleRemoveUploaded}
                    size={140}
                  />
                ))}
                <button onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-black/15 flex items-center justify-center hover:border-[#D63384]/40 transition-colors shrink-0"
                  style={{ width: 140, height: 140 }}>
                  <Plus size={24} className="text-[#ccc]" />
                </button>
              </div>
              {uploadedPhotos.length === 0 && (
                <p className="text-xs text-[#bbb] mt-2 text-center">Клікніть + щоб додати фото</p>
              )}
            </>
          )}

          {/* Tab 2 — AI генерація */}
          {tab === 2 && (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !aiLoading && handleGenerateAi()}
                  placeholder="Опишіть бажане зображення..."
                  className="flex-1 px-3 py-2 rounded-lg border border-black/9 text-xs outline-none placeholder-[#ccc]"
                  style={{ background: 'rgba(255,255,255,0.7)' }}
                />
                <button onClick={handleGenerateAi}
                  disabled={!aiPrompt.trim() || aiLoading}
                  className="px-4 py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-50 transition-all hover:-translate-y-px shrink-0"
                  style={{ background: brand.gradient, boxShadow: brand.shadow }}>
                  {aiLoading ? '...' : 'Генерувати'}
                </button>
              </div>

              {aiError && <p className="text-xs text-red-500 mb-2">{aiError}</p>}

              {aiLoading && (
                <div className="flex items-center justify-center py-6">
                  <p className="text-xs text-[#bbb] animate-pulse">Генерується зображення...</p>
                </div>
              )}

              {aiImages.length > 0 && (
                <div className="flex gap-2.5 flex-wrap mt-2">
                  {aiImages.map((url, i) => (
                    <PhotoThumb key={i}
                      src={url}
                      isSelected={selectedPhotos.includes(url)}
                      onToggle={onTogglePhoto}
                      onZoom={(src) => openModal(src, true)}
                      onRemove={handleRemoveAiImage}
                      onDownload={() => downloadBase64Image(url, i)}
                      size={140}
                    />
                  ))}
                </div>
              )}

              {aiImages.length === 0 && !aiLoading && (
                <p className="text-xs text-[#bbb] text-center py-2">Згенеровані зображення з'являться тут</p>
              )}
            </>
          )}
        </div>

        {/* Обрані фото */}
        {selectedPhotos.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-[#888] mb-2">
              Обрано фото: <span className="text-[#D63384]">{selectedPhotos.length}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {selectedPhotos.map((url, i) => (
                <div key={i} className="relative group cursor-pointer"
                  onClick={() => setModalSrc(url)}>
                  <img src={url} alt="" className="rounded-xl object-cover"
                    style={{ width: 64, height: 64 }} />
                  <button onClick={e => { e.stopPropagation(); onTogglePhoto(url); }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D63384] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={8} color="white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PhotoSection;
