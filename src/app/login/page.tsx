"use client";
import { useState, useEffect } from 'react';
import { authRepository } from '@/lib/api/authRepository';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // CSRF token’ı server’dan al
    fetch('/api/csrf', { credentials: 'include' }) // Cookie’leri dahil et
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((err) => console.error('CSRF token alınamadı:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrfToken) {
      toast.error('CSRF token yüklenemedi, lütfen sayfayı yenileyin.');
      return;
    }
    
    const loadingToast = toast.loading('Giriş yapılıyor...');
    try {
      const { token, user } = await authRepository.login(username, password, csrfToken);
      login(token, user);
      toast.success('Başarıyla giriş yapıldı!', { id: loadingToast });
      router.push('/dashboard');
    } catch (error) {
      toast.error('Giriş başarısız!', { id: loadingToast });
      setError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Giriş Yap</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                placeholder="Kullanıcı adınızı giriniz"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-150"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Şifre</label>
              <input
                type="password"
                placeholder="Şifrenizi giriniz"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-150"
                required
              />
            </div>
          </div>
          <input type="hidden" name="csrfToken" value={csrfToken} />
          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
          >
            Giriş Yap
          </button>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Kayıt Ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}