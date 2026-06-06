import { useState } from 'react';
import LeftPanel from './components/LeftPanel';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotScreen from './components/ForgotScreen';
import TermsModal from './components/TermsModal';
import { brand } from '../../utils/theme';

const BLOBS = [
  { color: '#f48fb1', style: { width: 500, height: 500, top: -150, left: -100, opacity: 0.22 } },
  { color: '#F5C842', style: { width: 380, height: 380, bottom: 0, right: '20%', opacity: 0.13 } },
  { color: '#E8799A', style: { width: 300, height: 300, top: '30%', left: '35%', opacity: 0.12 } },
];

const LoginPage = () => {
  const [screen, setScreen] = useState('login');
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ background: '#FDFAF7' }}>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      {BLOBS.map((b, i) => (
        <div key={i} className="fixed rounded-full pointer-events-none z-0"
          style={{ ...b.style, background: b.color, filter: 'blur(100px)' }} />
      ))}

      <LeftPanel />

      <div className="flex-[0_0_100%] lg:flex-[0_0_40%] flex flex-col items-center justify-center px-10 py-12 relative z-10"
        style={{ background: brand.glass, backdropFilter: brand.blur, borderLeft: brand.borderGlass }}>
        <div className="w-full max-w-[320px]">
          {screen === 'login' && <LoginScreen onSwitch={setScreen} onTerms={() => setShowTerms(true)} />}
          {screen === 'register' && <RegisterScreen onSwitch={setScreen} onTerms={() => setShowTerms(true)} />}
          {screen === 'forgot' && <ForgotScreen onSwitch={setScreen} />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;