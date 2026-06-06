import { brand } from '../../utils/theme';

const Button = ({ children, isLoading, className = '', ...props }) => (
  <button
    disabled={isLoading}
    className={`w-full py-3 px-5 rounded-full text-white text-[14px] font-semibold transition-all disabled:opacity-50 cursor-pointer hover:-translate-y-px ${className}`}
    style={{ background: brand.gradient, boxShadow: brand.shadow }}
    {...props}
  >
    {isLoading ? 'Завантаження...' : children}
  </button>
);

export default Button;