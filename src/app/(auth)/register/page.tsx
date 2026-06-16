'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistrationForm } from '@/components/organisms/forms/RegistrationForm';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    const success = await register(data.email, data.password, data.name);
    if (success) {
      router.push('/check-your-email');
    }
  };

  return (
    <RegistrationForm
      onSubmit={handleSubmit}
      resolver={zodResolver(registerSchema)}
      isLoading={isLoading}
      error={error}
    />
  );
}
