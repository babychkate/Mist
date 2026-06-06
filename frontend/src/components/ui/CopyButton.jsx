import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text, label = 'Копіювати', small = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-full border transition-all"
      style={{
        padding: small ? '4px 10px' : '7px 14px',
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        background: copied ? 'rgba(76,175,80,0.08)' : 'rgba(255,255,255,0.5)',
        border: copied ? '0.5px solid rgba(76,175,80,0.3)' : '0.5px solid rgba(0,0,0,0.1)',
        color: copied ? '#2e7d32' : '#666',
      }}>
      {copied ? <Check size={small ? 10 : 11} strokeWidth={3} /> : <Copy size={small ? 10 : 11} />}
      {copied ? 'Скопійовано' : label}
    </button>
  );
};

export default CopyButton;