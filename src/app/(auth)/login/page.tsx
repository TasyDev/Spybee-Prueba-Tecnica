'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginForm } from '@/components/organisms/forms/LoginForm';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (data: { email: string; password: string }) => {
    const success = await login(data.email, data.password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      resolver={zodResolver(loginSchema)}
      isLoading={isLoading}
      error={error}
    />
  );
}
