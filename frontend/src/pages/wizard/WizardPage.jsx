import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Blobs from '../../components/ui/Blobs';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import ProgressBar from './components/ProgressBar';
import { getPlatformsRequest } from '../../api/platform.api';
import { getTonesRequest } from '../../api/tone.api';
import { saveGenerationRequest } from '../../api/savegeneration.api';
import { parseDuration } from '../../utils/duration';

const WizardPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [video, setVideo] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [platforms, setPlatforms] = useState([]);
  const [tones, setTones] = useState([]);
  const [results, setResults] = useState({});
  const [editingPlatformId, setEditingPlatformId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPlatformsRequest().then(res => setPlatforms(res.data)).catch(() => {});
    getTonesRequest().then(res => setTones(res.data)).catch(() => {});
  }, []);

  const togglePlatform = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size === 1) return prev; next.delete(id); }
      else next.add(id);
      return next;
    });
  };

  const handleEditPlatform = (platformId) => {
    setEditingPlatformId(platformId);
    setStep(1);
  };

  const handleSaveMist = async () => {
    setSaving(true);
    try {
      const platformsPayload = platforms
        .filter(p => selected.has(p.platformId))
        .map(p => {
          const result = results[p.platformId] ?? {};
          const photos = (result.photos ?? []).map((photo, i) => ({
            url: photo.url,
            formatId: photo.formatId,
            photoType: result.photoSources
              ? result.photoSources[Math.floor(i / (result.formatsCount ?? 1))]
              : 'AI генерація',
          }));

          return {
            platformId: p.platformId,
            generatedText: result.text ?? '',
            generatedHashtags: result.hashtags ?? '',
            customPrompt: result.toneId ? null : (result.customPrompt ?? null),
            toneId: result.toneId ?? null,
            track: result.track ? {
              apiId: result.track.apiId,
              title: result.track.title,
              authorName: result.track.authorName,
              authorApiId: result.track.authorApiId ?? null,
              genre: result.track.genre ?? null,
              durationSeconds: parseDuration(result.track.duration),
              previewUrl: result.track.previewUrl,
            } : null,
            photos,
          };
        });

      await saveGenerationRequest({ videoId: video.videoId, platforms: platformsPayload });
      navigate('/dashboard');
    } catch (e) {
      console.error('Помилка збереження:', e);
      alert('Не вдалось зберегти. Спробуйте ще раз.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF7', color: '#1A1A1A' }}>
      <Blobs />
      <Navbar variant="wizard" />
      <ProgressBar current={step} />

      {step === 0 && (
        <Step1
          selected={selected}
          togglePlatform={togglePlatform}
          platforms={platforms}
          onVideoLoaded={setVideo}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <Step2
          selected={selected}
          platforms={platforms}
          video={video}
          tones={tones}
          results={results}
          setResults={setResults}
          editingPlatformId={editingPlatformId}
          setEditingPlatformId={setEditingPlatformId}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <Step3
          platforms={platforms}
          selected={selected}
          results={results}
          setResults={setResults}
          video={video}
          onBack={() => setStep(1)}
          onSave={handleSaveMist}
          saving={saving}
        />
      )}
    </div>
  );
};

export default WizardPage;