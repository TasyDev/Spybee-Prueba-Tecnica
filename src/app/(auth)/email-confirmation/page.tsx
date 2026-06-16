'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EmailVerificationCard } from '@/components/organisms/cards/EmailVerificationCard';
import { useAuth } from '@/hooks/useAuth';

function EmailConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, isLoading, error } = useAuth();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type === 'email') {
      const verify = async () => {
        const success = await verifyEmail(token_hash);
        if (success) {
          setVerified(true);
          // verifyOtp ya hizo login automáticamente
          // Redirigir a dashboard después de un delay
          setTimeout(() => router.push('/dashboard'), 2000);
        }
      };
      verify();
    }
  }, [searchParams, verifyEmail, router]);

  if (isLoading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
        <p>Verificando tu email</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0s',
            }}
          />
          <span
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0.2s',
            }}
          />
          <span
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '0.4s',
            }}
          />
        </div>
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: '#fff', textAlign: 'center' }}>
        <p>Error: {error}</p>
        <button onClick={() => router.push('/login')}>Ir al login</button>
      </div>
    );
  }

  return (
    <EmailVerificationCard
      variant={verified ? 'verified' : 'check-email'}
    />
  );
}

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center' }}>Cargando...</div>}>
      <EmailConfirmationContent />
    </Suspense>
  );
}
