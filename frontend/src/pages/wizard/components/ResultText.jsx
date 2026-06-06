import { useState } from 'react';
import { brand } from '../../../utils/theme';
import CopyButton from '../../../components/ui/CopyButton';

const ResultText = ({ text, hashtags, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(text);
  const [draftHashtags, setDraftHashtags] = useState(hashtags);

  const handleSave = () => { onSave(draftText, draftHashtags); setEditing(false); };
  const handleCancel = () => { setDraftText(text); setDraftHashtags(hashtags); setEditing(false); };

  return (
    <div className="rounded-xl p-4 border border-white/80 mb-3" style={{ background: 'rgba(255,255,255,0.5)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest">Текст поста</p>
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <CopyButton text={`${text}\n\n${hashtags}`} />
              <button onClick={() => setEditing(true)} className="text-xs text-[#D63384] font-medium hover:underline">
                Редагувати
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="text-xs text-[#888] font-medium hover:underline">Скасувати</button>
              <button onClick={handleSave}
                className="text-xs text-white font-semibold px-3 py-1 rounded-full"
                style={{ background: brand.gradient }}>Зберегти</button>
            </div>
          )}
        </div>
      </div>
      {editing ? (
        <>
          <textarea value={draftText} onChange={e => setDraftText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/9 text-xs outline-none resize-none mb-2"
            style={{ height: 110, background: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }} />
          <textarea value={draftHashtags} onChange={e => setDraftHashtags(e.target.value)}
            placeholder="#хештеги через пробіл..."
            className="w-full px-3 py-2 rounded-xl border border-black/9 text-xs outline-none resize-none"
            style={{ height: 48, background: 'rgba(255,255,255,0.8)', color: '#D63384' }} />
        </>
      ) : (
        <>
          <p className="text-xs text-[#1A1A1A] leading-relaxed mb-3">{text}</p>
          <div className="flex flex-wrap gap-1.5">
            {hashtags?.split(' ').filter(Boolean).map(h => (
              <span key={h} className="px-2 py-0.5 rounded-full text-xs font-medium text-[#D63384]"
                style={{ background: brand.bgLight }}>{h}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResultText;