const FieldView = ({ label, value, muted = false }) => (
  <div className="mb-3">
    <p className="text-xs font-semibold text-[#bbb] uppercase tracking-widest mb-1.5">{label}</p>
    <div className="px-3.5 py-2.5 rounded-xl border border-black/0.08 text-sm"
      style={{ background: 'rgba(255,255,255,0.5)', color: muted ? '#bbb' : '#1A1A1A', fontWeight: muted ? 400 : 500 }}>
      {value}
    </div>
  </div>
);

export default FieldView;