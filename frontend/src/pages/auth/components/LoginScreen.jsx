import { Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import useAuth from '../../../hooks/useAuth';
import { loginRequest } from '../../../api/auth.api';
import { loginSchema } from '../schemas';

const LoginScreen = ({ onSwitch, onTerms }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginRequest(data);
      const { token, userId, userName, email, avatarUrl } = response.data;
      login(token, { userId, userName, email, avatarUrl });
      navigate('/dashboard');
    } catch (error) {
      setError('root', { message: error.response?.data?.message || 'Невірний email або пароль' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h1 className="text-[22px] font-extrabold tracking-tight text-[#1A1A1A] mb-1">З поверненням</h1>
      <p className="text-[14px] text-[#888] mb-6">
        Ще немає акаунту?{' '}
        <button type="button" onClick={() => onSwitch('register')} className="text-[#D63384] font-semibold hover:underline">
          Зареєструйтесь
        </button>
      </p>
      <div className="flex flex-col gap-4 mb-2">
        <Input label="Email" type="text" placeholder="your@email.com" icon={<Mail size={15} />}
          error={errors.email?.message} {...register('email')} />
        <Input label="Пароль" type="password" placeholder="••••••••" icon={<Lock size={15} />}
          error={errors.password?.message} {...register('password')} />
      </div>
      <div className="text-right mb-5">
        <button type="button" onClick={() => onSwitch('forgot')}
          className="text-[12px] text-[#D63384] font-medium hover:underline">
          Забули пароль?
        </button>
      </div>
      {errors.root && <p className="text-[12px] text-red-500 text-center mb-3 font-medium">{errors.root.message}</p>}
      <Button type="submit" isLoading={isSubmitting}>Увійти</Button>
      <p className="text-[11px] text-[#aaa] text-center mt-4 leading-relaxed">
        Натискаючи, Ви погоджуєтесь з{' '}
        <button type="button" onClick={onTerms} className="text-[#D63384] font-medium hover:underline">
          умовами використання
        </button>
      </p>
    </form>
  );
};

export default LoginScreen;