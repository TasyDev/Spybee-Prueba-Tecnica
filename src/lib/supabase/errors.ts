export const SUPABASE_ERROR_MESSAGES: Record<string, string> = {
  'Error sending confirmation email':
    'Ya existe una cuenta con este email. Intenta iniciar sesión.',
  'Invalid login credentials':
    'Credenciales inválidas. Verifica tu email y contraseña.',
  'Password should be at least 6 characters':
    'La contraseña debe tener al menos 6 caracteres.',
  'User already registered':
    'Ya existe una cuenta con este email.',
  'Email not confirmed':
    'Tu email no ha sido verificado. Revisa tu bandeja de entrada.',
};

export function mapSupabaseError(message: string): string {
  return SUPABASE_ERROR_MESSAGES[message] || message;
}
