const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
    <div className="w-full max-w-sm rounded-2xl p-7"
      style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>
      <h2 className="text-[18px] font-extrabold text-[#1A1A1A] mb-2">Видалити акаунт?</h2>
      <p className="text-[13px] text-[#888] mb-6 leading-relaxed">
        Акаунт буде деактивовано. Всі ваші дані залишаться в системі але вхід буде неможливий.
      </p>
      <div className="flex gap-2">
        <button onClick={onConfirm}
          className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors">
          Так, видалити
        </button>
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-full border border-black/10 text-sm text-[#888]">
          Скасувати
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;