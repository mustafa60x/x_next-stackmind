"use client";

import { useAuthStore } from "@/stores";
import { UserAvatar } from "@/modules/user/components/UserAvatar";

interface DashboardHeaderProps {
  postCount?: number;
}

export const DashboardHeader = ({ postCount = 0 }: DashboardHeaderProps) => {
  const { user, logout } = useAuthStore();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <UserAvatar username={user?.username} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toplam Gönderi: {postCount}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};
