export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`API fetch error: ${res.statusText}`);
  }
  return res.json();
}
