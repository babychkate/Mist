import { brand } from '../../../utils/theme';

const Card = ({ children, className = '', danger = false }) => (
  <div className={`rounded-2xl p-6 ${className}`}
    style={{
      background: 'rgba(255,255,255,0.45)',
      backdropFilter: 'blur(18px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      border: danger ? '1px solid rgba(220,38,38,0.15)' : brand.borderGlass,
    }}>
    {children}
  </div>
);

export default Card;