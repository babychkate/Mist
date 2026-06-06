import { brand } from '../../../utils/theme';

const CtaButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-8 py-4 rounded-full text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
    style={{ background: brand.gradient, boxShadow: brand.shadow }}>
    {children}
  </button>
);

export default CtaButton;