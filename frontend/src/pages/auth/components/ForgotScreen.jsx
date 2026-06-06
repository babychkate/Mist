import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { brand } from '../../../utils/theme';
import { forgotSchema } from '../schemas';

const ForgotScreen = ({ onSwitch }) => {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async () => setSent(true);

  if (sent) return (
    <div className="w-full text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: brand.gradientLight }}>
        <Mail size={24} className="text-[#D63384]" />
      </div>
      <h1 className="text-[22px] font-extrabold tracking-tight text-[#1A1A1A] mb-2">Лист надіслано</h1>
      <p className="text-[14px] text-[#888] mb-6 leading-relaxed">
        Перевірте пошту та перейдіть за посиланням для скидання пароля
      </p>
      <button type="button" onClick={() => onSwitch('login')}
        className="w-full py-3 rounded-full border border-[#D63384]/20 text-[#D63384] text-[13px] font-medium hover:bg-[#D63384]/5 transition-colors">
        Повернутись до входу
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <button type="button" onClick={() => onSwitch('login')}
        className="flex items-center gap-1 text-[12px] text-[#aaa] hover:text-[#888] transition-colors mb-6">
        <ArrowRight size={13} className="rotate-180" /> Назад до входу
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-[#1A1A1A] mb-1">Відновлення пароля</h1>
      <p className="text-[14px] text-[#888] mb-6 leading-relaxed">
        Введіть email — ми надішлемо посилання для скидання пароля
      </p>
      <div className="mb-5">
        <Input label="Email" type="email" placeholder="your@email.com" icon={<Mail size={15} />}
          error={errors.email?.message} {...register('email')} />
      </div>
      <Button type="submit" isLoading={isSubmitting}>Надіслати посилання</Button>
    </form>
  );
};

export default ForgotScreen;