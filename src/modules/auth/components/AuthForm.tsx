"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "@/modules/common/components/LoadingSpinner";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "register";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, csrfToken, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </h1>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              autoComplete="username"
              placeholder="Kullanıcı adınızı giriniz"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-150"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Şifre
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Şifrenizi giriniz (en az 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-150"
              required
              minLength={6}
            />
          </div>
        </div>
        <input type="hidden" name="csrfToken" value={csrfToken} />

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 transition duration-150 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : mode === "login" ? (
              "Giriş Yap"
            ) : (
              "Kayıt Ol"
            )}
          </button>

          {mode === "login" ? (
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Hesabınız yok mu?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Kayıt Ol
              </Link>
            </p>
          ) : (
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Zaten hesabınız var mı?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Giriş Yap
              </Link>
            </p>
          )}
        </div>
      </form>
    </>
  );
};
