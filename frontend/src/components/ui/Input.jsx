const Input = ({ label, error, icon, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-[12px] font-semibold text-[#444] tracking-wide">{label}</label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc]">
          {icon}
        </div>
      )}
      <input
        className={`w-full py-3 rounded-xl border outline-none transition-all text-[14px] text-[#1A1A1A] placeholder-[#ccc]
          ${icon ? 'pl-9 pr-4' : 'px-4'}
          ${error
            ? 'border-red-400 bg-white shadow-[0_0_0_3px_rgba(239,68,68,0.07)]'
            : 'border-black/10 bg-white/75 focus:border-[#D63384]/35 focus:bg-white focus:shadow-[0_0_0_3px_rgba(214,51,132,0.07)]'
          }`}
        {...props}
      />
    </div>
    {error && (
      <span className="text-[11px] text-red-500 font-medium pl-1">{error}</span>
    )}
  </div>
);

export default Input;