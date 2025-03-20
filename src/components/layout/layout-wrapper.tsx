"use client";

import { ReactNode, useEffect, useState } from "react";
import MainHeader from "@/components/main-header/header-component";
import { useAuth } from "@/context/auth-context";
import { useAuthStore } from "@/stores/auth";
import { authRepository } from "@/lib/api";
import { LoadingSpinner } from "@/modules/common/components/LoadingSpinner";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  // set state for loading
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthPage } = useAuth();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const data = await authRepository.getProfile();
      if (data) {
        setUser(data);
      }
      setIsLoading(false);
    };
    if (!isAuthPage && !user) {
      loadUser();
    }
  }, [isAuthPage]);

  if (isLoading && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!isAuthPage && <MainHeader />}
      <main
        className={isAuthPage ? "h-screen" : "h-[calc(100vh-64px)]"}
        style={{ overflow: "auto" }}
      >
        {children}
      </main>
    </>
  );
}
