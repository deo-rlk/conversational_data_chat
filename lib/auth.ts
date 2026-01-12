import { User, Role } from '@/types/auth';

// Mock authentication - in production this should be handled by backend
export function mockLogin(email: string, role: Role = 'user'): User {
  return {
    id: `user-${Date.now()}`,
    email,
    name: email.split('@')[0],
    role,
    lookerUser: email.split('@')[0],
  };
}

export function mockLogout(): void {
  // In production, clear session tokens
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('mock_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mock_user', JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('mock_user');
}
