"use client";
import { useState } from 'react';
import { authRepository } from '@/lib/api/authRepository';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await authRepository.register(username, password);
      login(token, user);
      router.push('/dashboard');
    } catch {
      setError('Kayıt başarısız!');
    }
  };

  return (
    <div className="min-h-full bg-white dark:bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-100 dark:bg-gray-800 rounded">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Kayıt Ol</h1>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full rounded text-black dark:text-white bg-white dark:bg-gray-700"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full rounded text-black dark:text-white bg-white dark:bg-gray-700"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}