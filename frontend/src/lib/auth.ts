export function logout(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
