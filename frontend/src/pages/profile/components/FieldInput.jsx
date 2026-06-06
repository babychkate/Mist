const FieldInput = ({ label, ...props }) => (
  <div className="mb-3">
    <p className="text-xs font-semibold text-[#bbb] uppercase tracking-widest mb-1.5">{label}</p>
    <input
      className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#1A1A1A] outline-none"
      style={{
        border: '1px solid rgba(214,51,132,0.35)',
        background: 'rgba(255,255,255,0.8)',
        boxShadow: '0 0 0 3px rgba(214,51,132,0.07)',
      }}
      {...props}
    />
  </div>
);

export default FieldInput;