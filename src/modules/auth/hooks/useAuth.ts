"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { authRepository } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores";
import analytics from "@/lib/analytics";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const { login: storeLogin } = useAuthStore();

  useEffect(() => {
    analytics.log("Auth page rendered");
    analytics.trackEvent("auth_view", { user: "anonymous" });

    // CSRF token’ı server’dan al
    getCsrfToken()
      .then((csrfToken) => setCsrfToken(csrfToken))
      .catch((err) => console.error("CSRF token alınamadı:", err));
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await authRepository.getProfile();
      analytics.trackEvent("auth_check", { user: userData.username });
    } catch (error) {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const getCsrfToken = async () => {
    const response = await fetch("/api/csrf", { credentials: "include" });
    const data = await response.json();
    return data.csrfToken;
  };

  const login = async (username: string, password: string) => {
    const loadingToast = toast.loading("Giriş yapılıyor...");

    try {
      const { token, user: userData } = await authRepository.login(
        username,
        password,
        csrfToken
      );
      await storeLogin(token, userData);
      toast.success("Başarıyla giriş yapıldı!", { id: loadingToast });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Giriş başarısız!", { id: loadingToast });
      setError("Kullanıcı adı veya şifre hatalı!");
      analytics.error(error, { user: username });
    }
  };

  const register = async (username: string, password: string) => {
    const loadingToast = toast.loading("Kayıt işlemi yapılıyor...");

    try {
      const { token, user: userData } = await authRepository.register(
        username,
        password
      );
      await storeLogin(token, userData);
      toast.success("Kayıt başarıyla tamamlandı!", { id: loadingToast });
      router.push("/dashboard");
    } catch (error) {
      toast.error("Kayıt başarısız oldu!", { id: loadingToast });
      setError("Bu kullanıcı adı zaten kullanılıyor olabilir.");
    }
  };

  const logout = async () => {
    try {
      // Clear cookies by making a request to the logout endpoint
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      toast.success("Çıkış yapıldı");
    } catch (error) {
      toast.error("Çıkış yapılamadı");
    }
  };

  return {
    csrfToken,
    error,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };
};
