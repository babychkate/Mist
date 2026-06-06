import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { getPlatformFormatsRequest } from '../../../api/platform.api';

const FormatSection = ({ platformId, selectedFormatIds, onToggleFormat, onFormatsLoaded }) => {
  const [formats, setFormats] = useState([]);

  useEffect(() => {
    if (!platformId) return;
    getPlatformFormatsRequest(platformId)
      .then(res => {
        setFormats(res.data);
        onFormatsLoaded?.(res.data); // ← передаємо список форматів нагору
      })
      .catch(() => {});
  }, [platformId]);

  if (formats.length === 0) return null;

  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3">Формати</p>
      <div className="flex flex-wrap gap-2">
        {formats.map(f => {
          const isSelected = selectedFormatIds.includes(f.platformPhotoFormatId);
          return (
            <button key={f.platformPhotoFormatId}
              onClick={() => onToggleFormat(f.platformPhotoFormatId)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all"
              style={isSelected
                ? { background: 'rgba(232,121,154,0.10)', border: '1px solid rgba(214,51,132,0.3)', color: '#D63384' }
                : { background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.1)', color: '#666' }}>
              {isSelected && <Check size={10} strokeWidth={3} />}
              <span>{f.formatTypeName}</span>
              <span className="text-[#bbb] font-normal">{f.width}×{f.height}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FormatSection;