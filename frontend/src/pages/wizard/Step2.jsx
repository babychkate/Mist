import { useState, useEffect } from 'react';
import { Check, ChevronRight, Music2, Sparkles } from 'lucide-react';
import { brand } from '../../utils/theme';
import { platformConfig } from '../../components/ui/PlatformIcon';
import PhotoSection from './components/PhotoSection';
import FormatSection from './components/FormatSection';
import MusicSection from './components/MusicSection';
import ResultText from './components/ResultText';
import ResultPhoto from './components/ResultPhoto';
import { AlertTriangle } from 'lucide-react';
import { generatePlatformRequest, toBase64 } from '../../api/generationplatform.api';

const GENERATION_STEPS = [
  { id: 'tone',   label: 'Аналізую тон і платформу' },
  { id: 'text',   label: 'Генерую текст поста' },
  { id: 'photos', label: 'Обробляю фото через Cloudinary' },
  { id: 'result', label: 'Готую результат' },
];

const GeneratingPanel = ({ currentStep }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-72">
    <div className="w-full max-w-xs">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={16} className="text-[#D63384]" />
        <p className="text-sm font-bold text-[#1A1A1A]">Генерація...</p>
      </div>
      <div className="flex flex-col gap-3">
        {GENERATION_STEPS.map((step, i) => {
          const stepIdx = GENERATION_STEPS.findIndex(s => s.id === currentStep);
          const isDone = i < stepIdx;
          const isActive = step.id === currentStep;
          return (
            <div key={step.id} className="flex items-center gap-3">
              <span className="text-base shrink-0" style={{ opacity: isDone ? 1 : isActive ? 1 : 0.25 }}>✦</span>
              <p className="text-xs transition-all"
                style={{
                  color: isDone ? '#2e7d32' : isActive ? '#1A1A1A' : '#ccc',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>
                {step.label}{isActive ? '...' : ''}
              </p>
              {isActive && <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ background: '#D63384' }} />}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const Step2 = ({ selected, platforms, video, tones, results, setResults, onNext, onBack, editingPlatformId, setEditingPlatformId }) => {
  const selectedPlatforms = platforms.filter(p => selected.has(p.platformId));
  const startIdx = editingPlatformId ? selectedPlatforms.findIndex(p => p.platformId === editingPlatformId) : 0;

  const [activePlatformIdx, setActivePlatformIdx] = useState(startIdx >= 0 ? startIdx : 0);
  const [donePlatforms, setDonePlatforms] = useState(
    editingPlatformId
      ? new Set(selectedPlatforms.map(p => p.platformId).filter(id => id !== editingPlatformId))
      : new Set()
  );

  const [toneByPlatform, setToneByPlatform] = useState({});
  const [customOnByPlatform, setCustomOnByPlatform] = useState({});
  const [customPromptByPlatform, setCustomPromptByPlatform] = useState({});
  const [photosByPlatform, setPhotosByPlatform] = useState({});
  const [formatsByPlatform, setFormatsByPlatform] = useState({});
  const [availableFormatsByPlatform, setAvailableFormatsByPlatform] = useState({});
  const [uploadedPhotosByPlatform, setUploadedPhotosByPlatform] = useState({});
  const [aiImagesByPlatform, setAiImagesByPlatform] = useState({});
  const [trackByPlatform, setTrackByPlatform] = useState({});

  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(null);
  const [generateError, setGenerateError] = useState('');
  const [generated, setGenerated] = useState(!!editingPlatformId);
  const [isDirty, setIsDirty] = useState(false);

  const activePlatform = selectedPlatforms[activePlatformIdx];
  const isLast = activePlatformIdx === selectedPlatforms.length - 1;

  useEffect(() => {
    if (tones.length > 0 && activePlatform) {
      const pid = activePlatform.platformId;
      setToneByPlatform(prev => {
        if (prev[pid] !== undefined) return prev;
        return { ...prev, [pid]: tones[0].toneId };
      });
    }
  }, [tones, activePlatform?.platformId]);

  // скидаємо isDirty при переключенні платформи
  useEffect(() => {
    setIsDirty(false);
  }, [activePlatformIdx]);

  const selectedToneId = toneByPlatform[activePlatform?.platformId] ?? (tones[0]?.toneId ?? null);
  const customOn = customOnByPlatform[activePlatform?.platformId] ?? false;
  const customPrompt = customPromptByPlatform[activePlatform?.platformId] ?? '';
  const selectedPhotos = photosByPlatform[activePlatform?.platformId] ?? [];
  const selectedFormatIds = formatsByPlatform[activePlatform?.platformId] ?? [];
  const uploadedPhotos = uploadedPhotosByPlatform[activePlatform?.platformId] ?? [];
  const aiImages = aiImagesByPlatform[activePlatform?.platformId] ?? [];
  const selectedTrack = trackByPlatform[activePlatform?.platformId] ?? null;
  const hasPhotos = selectedPhotos.length > 0;

  const handleSelectTone = (toneId) => {
    const pid = activePlatform.platformId;
    setToneByPlatform(prev => ({ ...prev, [pid]: toneId }));
    setCustomOnByPlatform(prev => ({ ...prev, [pid]: false }));
    setIsDirty(true);
  };

  const handleToggleCustomOn = () => {
    const pid = activePlatform.platformId;
    setCustomOnByPlatform(prev => ({ ...prev, [pid]: !prev[pid] }));
    setIsDirty(true);
  };

  const handleCustomPromptChange = (val) => {
    const pid = activePlatform.platformId;
    setCustomPromptByPlatform(prev => ({ ...prev, [pid]: val }));
    setIsDirty(true);
  };

  const handleTogglePhoto = (url) => {
    const pid = activePlatform.platformId;
    setPhotosByPlatform(prev => {
      const current = prev[pid] ?? [];
      const next = current.includes(url) ? current.filter(u => u !== url) : [...current, url];
      if (!current.includes(url) && current.length === 0) {
        const available = availableFormatsByPlatform[pid] ?? [];
        if (available.length > 0) {
          setFormatsByPlatform(fp => ({
            ...fp,
            [pid]: fp[pid]?.length > 0 ? fp[pid] : [available[0].platformPhotoFormatId]
          }));
        }
      }
      if (current.includes(url) && current.length === 1) {
        setFormatsByPlatform(fp => ({ ...fp, [pid]: [] }));
      }
      return { ...prev, [pid]: next };
    });
    setIsDirty(true);
  };

  const handleToggleFormat = (id) => {
    if (!hasPhotos) return;
    const pid = activePlatform.platformId;
    setFormatsByPlatform(prev => {
      const current = prev[pid] ?? [];
      if (current.includes(id)) {
        if (current.length === 1) return prev;
        return { ...prev, [pid]: current.filter(i => i !== id) };
      }
      return { ...prev, [pid]: [...current, id] };
    });
    setIsDirty(true);
  };

  const handleFormatsLoaded = (formats) => {
    const pid = activePlatform.platformId;
    setAvailableFormatsByPlatform(prev => ({ ...prev, [pid]: formats }));
  };

  const handleTrackChange = (track) => {
    const pid = activePlatform.platformId;
    setTrackByPlatform(prev => ({ ...prev, [pid]: track }));
    setIsDirty(true);
  };

  const handleTextSave = (newText, newHashtags) => {
    const pid = activePlatform.platformId;
    setResults(prev => ({ ...prev, [pid]: { ...prev[pid], text: newText, hashtags: newHashtags } }));
  };

  const handleRemovePhoto = (formatId, url) => {
    const pid = activePlatform.platformId;
    setResults(prev => ({
      ...prev,
      [pid]: { ...prev[pid], photos: prev[pid].photos.filter(p => !(p.formatId === formatId && p.url === url)) }
    }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    setGenerateError('');
    setIsDirty(false);
    try {
      setGeneratingStep('tone');
      const photosBase64 = await Promise.all(selectedPhotos.map(toBase64));
      const photoSources = selectedPhotos.map(url => {
        if (url.includes('img.youtube.com')) return 'YouTube thumbnail';
        if (url.startsWith('data:')) return 'AI генерація';
        return 'Фото з вашого пристрою';
      });
      await sleep(600);

      setGeneratingStep('text');
      const res = await generatePlatformRequest({
        platformId: activePlatform.platformId,
        videoId: video.videoId,
        toneId: customOn ? null : selectedToneId,
        customPrompt: customOn ? customPrompt : null,
        photos: photosBase64,
        formatIds: selectedFormatIds,
      });
      await sleep(400);

      setGeneratingStep('photos');
      await sleep(500);
      setGeneratingStep('result');
      await sleep(400);

      setResults(prev => ({
        ...prev,
        [activePlatform.platformId]: {
          text: res.data.generatedText,
          hashtags: res.data.generatedHashtags,
          photos: res.data.photos,
          formatIds: selectedFormatIds,
          track: selectedTrack,
          toneId: customOn ? null : selectedToneId,
          customPrompt: customOn ? customPrompt : null,
          photoSources,
          formatsCount: selectedFormatIds.length,
        }
      }));
      setGenerated(true);
    } catch {
      setGenerateError('Не вдалось згенерувати. Спробуйте ще раз.');
      setGenerated(false);
    } finally {
      setGenerating(false);
      setGeneratingStep(null);
    }
  };

  const handleSaveAndNext = () => {
    setDonePlatforms(prev => new Set([...prev, activePlatform.platformId]));
    if (editingPlatformId) {
      setEditingPlatformId(null);
      onNext();
    } else if (isLast) {
      onNext();
    } else {
      setActivePlatformIdx(i => i + 1);
      setGenerated(false);
      setGenerateError('');
    }
  };

  if (!activePlatform) return null;
  const currentResult = results[activePlatform.platformId];

  const canSwitchTo = (i) => i === activePlatformIdx || donePlatforms.has(selectedPlatforms[i].platformId);

  return (
    <div className="relative z-10 flex flex-col" style={{ minHeight: 'calc(100vh - 115px)' }}>
      <div className="flex items-center gap-2 border-b border-black/5 z-30"
        style={{ top: 115, padding: '12px 24px', background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(10px)' }}>
        {selectedPlatforms.map((p, i) => {
          const isDone = donePlatforms.has(p.platformId);
          const isActive = i === activePlatformIdx;
          const canSwitch = canSwitchTo(i);
          const meta = platformConfig[p.platformName] ?? { bg: '#999' };
          return (
            <button key={p.platformId}
              onClick={() => {
                if (!canSwitch) return;
                setActivePlatformIdx(i);
                setGenerated(isDone || !!results[p.platformId]);
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium transition-all"
              style={{
                ...(isDone
                  ? { background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)', color: '#2e7d32' }
                  : isActive
                    ? { background: brand.bgLight, border: '1px solid rgba(214,51,132,0.3)', color: '#D63384', fontWeight: 600 }
                    : { background: 'transparent', border: '1px solid rgba(0,0,0,0.08)', color: '#888' }),
                opacity: canSwitch ? 1 : 0.4,
                cursor: canSwitch ? 'pointer' : 'not-allowed',
              }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.bg }} />
              {p.platformName}
              {isDone && <Check size={10} strokeWidth={3} />}
            </button>
          );
        })}
        <ChevronRight size={14} className="text-[#ccc] ml-auto" />
      </div>

      <div className="grid flex-1" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="p-6 border-r border-black/6 overflow-y-auto">
          <p className="text-base font-extrabold tracking-tight mb-1">{activePlatform.platformName}</p>
          <p className="text-xs text-[#bbb] mb-5">Налаштуйте контент для цієї платформи</p>

          <div className="mb-5">
            <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3">Тон тексту</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {tones.map(t => (
                <button key={t.toneId}
                  onClick={() => handleSelectTone(t.toneId)}
                  className="px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all"
                  title={t.toneDescription ?? ''}
                  style={selectedToneId === t.toneId && !customOn
                    ? { background: brand.bgLight, border: '1px solid #D63384', color: '#D63384', fontWeight: 600 }
                    : { background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.1)', color: '#666' }}>
                  {t.toneName}
                </button>
              ))}
            </div>
            <button onClick={handleToggleCustomOn}
              className="flex items-center gap-2 text-xs text-[#aaa] mb-2 cursor-pointer bg-transparent border-none">
              <div className="w-7 h-4 rounded-full relative transition-all shrink-0"
                style={{ background: customOn ? brand.gradient : 'rgba(0,0,0,0.12)' }}>
                <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                  style={{ left: customOn ? 14 : 2 }} />
              </div>
              Кастомний промпт
            </button>
            {customOn && (
              <textarea
                value={customPrompt}
                onChange={e => handleCustomPromptChange(e.target.value)}
                placeholder="Опишіть бажаний стиль тексту..."
                className="w-full px-3 py-2.5 rounded-xl border border-black/9 text-xs outline-none resize-none placeholder-[#ccc]"
                style={{ height: 64, background: 'rgba(255,255,255,0.6)' }}
              />
            )}
          </div>

          <PhotoSection
            video={video}
            selectedPhotos={selectedPhotos}
            onTogglePhoto={handleTogglePhoto}
            uploadedPhotos={uploadedPhotos}
            onUploadedPhotosChange={(urls) => {
              const pid = activePlatform.platformId;
              setUploadedPhotosByPlatform(prev => ({ ...prev, [pid]: urls }));
              setIsDirty(true);
            }}
            aiImages={aiImages}
            onAiImagesChange={(imgs) => {
              const pid = activePlatform.platformId;
              setAiImagesByPlatform(prev => ({ ...prev, [pid]: imgs }));
            }}
          />

          <div style={{ opacity: hasPhotos ? 1 : 0.4, pointerEvents: hasPhotos ? 'auto' : 'none' }}>
            <FormatSection
              platformId={activePlatform.platformId}
              selectedFormatIds={selectedFormatIds}
              onToggleFormat={handleToggleFormat}
              onFormatsLoaded={handleFormatsLoaded}
            />
          </div>
          {!hasPhotos && <p className="text-xs text-[#bbb] mb-5 -mt-3">Спочатку оберіть фото</p>}

          <MusicSection selectedTrack={selectedTrack} onTrackChange={handleTrackChange} />

          {generated && isDirty && (
            <div className="flex items-center gap-2 text-xs text-yellow-600 mb-2 px-3 py-2 rounded-xl border border-yellow-200 bg-yellow-50">
              <AlertTriangle size={13} className="shrink-0" />
              Налаштування змінились — перегенеруйте пост щоб результат відповідав поточним параметрам.
            </div>
          )}

          {generateError && <p className="text-xs text-red-400 mb-2">{generateError}</p>}

          <button onClick={handleGenerate} disabled={generating || !hasPhotos}
            className="w-full py-3 rounded-full text-white text-sm font-semibold hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: brand.gradient, boxShadow: brand.shadow }}>
            {generating ? 'Генерується...' : `Згенерувати для ${activePlatform.platformName}`}
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ background: 'rgba(255,255,255,0.18)' }}>
          {generating && generatingStep && <GeneratingPanel currentStep={generatingStep} />}

          {!generating && !generated && (
            <div className="flex flex-col items-center justify-center h-full min-h-72 text-center text-[#ccc]">
              <div className="text-3xl mb-3 opacity-50">✦</div>
              <p className="text-sm font-medium">Результат з'явиться тут</p>
              <p className="text-xs mt-1 opacity-70">Натисніть "Згенерувати" щоб побачити пост</p>
            </div>
          )}

          {!generating && generated && currentResult && (
            <div>
              <p className="text-sm font-bold mb-4">Результат для {activePlatform.platformName}</p>
              <ResultText text={currentResult.text} hashtags={currentResult.hashtags} onSave={handleTextSave} />

              {currentResult.photos?.length > 0 && (
                <div className="rounded-xl p-4 border border-white/80 mb-3" style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest mb-3">Фото</p>
                  <div className="flex gap-3 flex-wrap items-end">
                    {currentResult.photos.map((photo, i) => (
                      <ResultPhoto key={i} photo={photo} onRemove={handleRemovePhoto} />
                    ))}
                  </div>
                </div>
              )}

              {currentResult.track && (
                <div className="rounded-xl p-4 border border-white/80 mb-5" style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <p className="text-xs font-bold text-[#ccc] uppercase tracking-widest mb-3">Трек</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg,#fffde7,#ffe082)' }}>
                      <Music2 size={14} className="text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{currentResult.track.title}</p>
                      <p className="text-xs text-[#aaa]">Jamendo · {currentResult.track.duration}</p>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleSaveAndNext}
                className="w-full py-3 rounded-full text-white text-sm font-semibold hover:-translate-y-0.5 transition-all"
                style={{ background: editingPlatformId ? brand.gradient : '#1A1A1A', boxShadow: editingPlatformId ? brand.shadow : 'none' }}>
                {editingPlatformId
                  ? 'Зберегти зміни і повернутись до огляду'
                  : isLast ? 'Зберегти і перейти до огляду'
                  : `Зберегти і продовжити для ${selectedPlatforms[activePlatformIdx + 1]?.platformName}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2;