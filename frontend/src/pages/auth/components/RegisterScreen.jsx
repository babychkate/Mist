import { Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useAuth from '../../../hooks/useAuth';
import { registerRequest } from '../../../api/auth.api';
import { registerSchema } from '../schemas';

const RegisterScreen = ({ onSwitch, onTerms }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await registerRequest({ userName: data.name, email: data.email, password: data.password });
      const { token, userId, userName, email } = response.data;
      login(token, { userId, userName, email });
      navigate('/dashboard');
    } catch (error) {
      setError('root', { message: error.response?.data?.message || 'Помилка реєстрації' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h1 className="text-[22px] font-extrabold tracking-tight text-[#1A1A1A] mb-1">Почніть безкоштовно</h1>
      <p className="text-[14px] text-[#888] mb-6">
        Вже є акаунт?{' '}
        <button type="button" onClick={() => onSwitch('login')} className="text-[#D63384] font-semibold hover:underline">
          Увійдіть
        </button>
      </p>
      <div className="flex flex-col gap-4 mb-5">
        <Input label="Ім'я" type="text" placeholder="Як до Вас звертатись?" icon={<User size={15} />}
          error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="text" placeholder="your@email.com" icon={<Mail size={15} />}
          error={errors.email?.message} {...register('email')} />
        <Input label="Пароль" type="password" placeholder="Придумайте надійний пароль" icon={<Lock size={15} />}
          error={errors.password?.message} {...register('password')} />
      </div>
      {errors.root && <p className="text-[12px] text-red-500 text-center mb-3 font-medium">{errors.root.message}</p>}
      <Button type="submit" isLoading={isSubmitting}>Створити акаунт</Button>
      <p className="text-[11px] text-[#aaa] text-center mt-4 leading-relaxed">
        Реєструючись, Ви погоджуєтесь з{' '}
        <button type="button" onClick={onTerms} className="text-[#D63384] font-medium hover:underline">умовами та політикою конфіденційності</button>
      </p>
    </form>
  );
};

export default RegisterScreen;