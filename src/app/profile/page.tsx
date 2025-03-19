"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';
import { authRepository } from '@/lib/api/authRepository';

export default function Profile() {
  const { logout } = useAuthStore();
  const [profile, setProfile] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authRepository.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Profil yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-gray-900 p-4">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-black dark:text-white">Profil Sayfası</h1>
      <p className="text-black dark:text-white">Kullanıcı Adı: {profile?.username}</p>
      <p className="text-black dark:text-white">ID: {profile?.id}</p>
      <button
        onClick={logout}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Çıkış Yap
      </button>
    </div>
  );
}