import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Blobs from '../../components/ui/Blobs';
import useAuth from '../../hooks/useAuth';
import { brand } from '../../utils/theme';
import { VALIDATION } from '../../utils/validationMessages';
import PlatformIcon from '../../components/ui/PlatformIcon';
import Card from './components/Card';
import FieldView from './components/FieldView';
import FieldInput from './components/FieldInput';
import DeleteModal from './components/DeleteModal';
import {
  getProfileRequest,
  updateProfileRequest,
  changePasswordRequest,
  updateAvatarRequest,
  deleteAccountRequest,
} from '../../api/profile.api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const avatarInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingPass, setEditingPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfileRequest();
        setProfile(response.data);
        setDraftName(response.data.userName);
        setDraftEmail(response.data.email);
      } catch {
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [logout, navigate]);

  const handleSaveInfo = async () => {
    setInfoError('');
    setInfoSuccess('');
    if (!draftName.trim() || draftName.trim().length < 2) { setInfoError(VALIDATION.nameMinLength); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(draftEmail.trim())) { setInfoError(VALIDATION.emailInvalid); return; }
    try {
      await updateProfileRequest({ userName: draftName.trim(), email: draftEmail.trim() });
      setProfile(prev => ({ ...prev, userName: draftName.trim(), email: draftEmail.trim() }));
      setUser({ ...user, userName: draftName.trim(), email: draftEmail.trim() });
      setEditingInfo(false);
      setInfoSuccess('Збережено');
    } catch (error) {
      setInfoError(error.response?.data?.message || 'Помилка збереження');
    }
  };

  const handleChangePassword = async () => {
    setPassError('');
    setPassSuccess('');
    if (!currentPassword) { setPassError(VALIDATION.passwordRequired); return; }
    if (!newPassword || newPassword.length < 6) { setPassError(VALIDATION.passwordMinLength); return; }
    if (newPassword !== confirmPassword) { setPassError(VALIDATION.passwordMismatch); return; }
    try {
      await changePasswordRequest({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditingPass(false);
      setPassSuccess('Пароль змінено');
    } catch (error) {
      setPassError(error.response?.data?.message || 'Помилка зміни пароля');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const response = await updateAvatarRequest(file);
      setProfile(prev => ({ ...prev, avatarUrl: response.data.avatarUrl }));
      setUser({ ...user, avatarUrl: response.data.avatarUrl });
    } catch { /* тихо */ }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountRequest();
      logout();
      navigate('/login');
    } catch {
      setShowDeleteModal(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF7' }}>
      <p className="text-sm text-[#bbb]">Завантаження...</p>
    </div>
  );

  const firstLetter = profile.userName?.charAt(0).toUpperCase();
  const registerDate = new Date(profile.registerDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  const daysSince = Math.floor((new Date() - new Date(profile.registerDate)) / (1000 * 60 * 60 * 24)) + 1;
  const lastGenDate = profile.lastGenerationDate
    ? new Date(profile.lastGenerationDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'numeric', year: 'numeric' })
    : '—';

  const STATS = [
    { val: profile.generationsCount, label: 'Генерацій' },
    { val: profile.videosCount, label: 'Відео' },
    { val: daysSince, label: 'Днів активності' },
    { val: lastGenDate, label: 'Остання генерація' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF7', color: '#1A1A1A' }}>
      {showDeleteModal && <DeleteModal onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} />}
      <Blobs />
      <Navbar variant="app" />

      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

      <div className="relative z-10 max-w-3xl mx-auto px-10 py-8">
        <p className="text-xl font-extrabold tracking-tight mb-6">Профіль</p>

        <Card className="mb-4">
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              {profile.avatarUrl
                ? <img src={profile.avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
                : <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                    style={{ background: brand.gradient }}>{firstLetter}</div>
              }
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#1A1A1A] flex items-center justify-center border-2 border-[#FDFAF7]">
                <Pencil size={9} color="white" />
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-[#1A1A1A] mb-0.5">{profile.userName}</p>
              <p className="text-xs text-[#bbb]">З нами з {registerDate} · {daysSince} днів</p>
            </div>
          </div>
        </Card>

        <Card className="mb-4">
          <div className="grid grid-cols-4 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center border border-white/80"
                style={{ background: 'rgba(255,255,255,0.5)' }}>
                <p className="text-xl font-extrabold tracking-tight text-[#1A1A1A] leading-none mb-1">{s.val}</p>
                <p className="text-xs text-[#bbb] font-medium leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-[#1A1A1A]">Особисті дані</p>
              {!editingInfo && (
                <button onClick={() => { setDraftName(profile.userName); setDraftEmail(profile.email); setEditingInfo(true); }}
                  className="text-xs text-[#D63384] font-medium hover:underline">Редагувати</button>
              )}
            </div>
            {!editingInfo ? (
              <>
                <FieldView label="Ім'я" value={profile.userName} muted/>
                <FieldView label="Email" value={profile.email} muted/>
                {infoSuccess && <p className="text-xs text-green-500 font-medium">{infoSuccess}</p>}
              </>
            ) : (
              <>
                <FieldInput label="Ім'я" type="text" value={draftName} onChange={e => setDraftName(e.target.value)} />
                <FieldInput label="Email" type="email" value={draftEmail} onChange={e => setDraftEmail(e.target.value)} />
                {infoError && <p className="text-xs text-red-500 mb-2">{infoError}</p>}
                <div className="flex gap-2 mt-1">
                  <button onClick={handleSaveInfo}
                    className="px-5 py-2 rounded-full text-white text-xs font-semibold"
                    style={{ background: brand.gradient }}>Зберегти</button>
                  <button onClick={() => { setEditingInfo(false); setInfoError(''); }}
                    className="px-5 py-2 rounded-full border border-black/10 text-xs text-[#888]">Скасувати</button>
                </div>
              </>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-[#1A1A1A]">Пароль</p>
              {!editingPass && (
                <button onClick={() => setEditingPass(true)}
                  className="text-xs text-[#D63384] font-medium hover:underline">Змінити</button>
              )}
            </div>
            {!editingPass ? (
              <>
                <FieldView label="Поточний пароль" value="••••••••••••" muted />
                {passSuccess && <p className="text-xs text-green-500 font-medium mt-2">{passSuccess}</p>}
              </>
            ) : (
              <>
                <FieldInput label="Поточний пароль" type="password" placeholder="Введіть поточний пароль"
                  value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                <FieldInput label="Новий пароль" type="password" placeholder="Мінімум 6 символів"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <FieldInput label="Підтвердження" type="password" placeholder="Повторіть новий пароль"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                {passError && <p className="text-xs text-red-500 mb-2">{passError}</p>}
                <div className="flex gap-2 mt-1">
                  <button onClick={handleChangePassword}
                    className="px-5 py-2 rounded-full text-white text-xs font-semibold"
                    style={{ background: brand.gradient }}>Зберегти</button>
                  <button onClick={() => { setEditingPass(false); setPassError(''); }}
                    className="px-5 py-2 rounded-full border border-black/10 text-xs text-[#888]">Скасувати</button>
                </div>
              </>
            )}
          </Card>

          <Card>
            <p className="text-sm font-bold text-[#1A1A1A] mb-4">Улюблена платформа</p>
            {profile.favoritePlatform ? (
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-white/80"
                style={{ background: 'rgba(255,255,255,0.5)' }}>
                <PlatformIcon name={profile.favoritePlatform} size={36} iconSize={18} />
                <p className="text-sm font-bold text-[#1A1A1A]">{profile.favoritePlatform}</p>
              </div>
            ) : (
              <p className="text-sm text-[#bbb]">Ще немає генерацій</p>
            )}
          </Card>

          <Card danger>
            <p className="text-sm font-bold text-[#1A1A1A] mb-4">Акаунт</p>
            <button onClick={handleLogout}
              className="w-full py-2.5 rounded-full border border-black/10 text-sm font-medium text-[#888] hover:bg-black/0.03 transition-colors mb-2">
              Вийти з акаунту
            </button>
            <button onClick={() => setShowDeleteModal(true)}
              className="w-full py-2.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              style={{ border: '1px solid rgba(220,38,38,0.2)' }}>
              Видалити акаунт
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;