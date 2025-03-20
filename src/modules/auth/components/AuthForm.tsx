"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "@/modules/common/components/LoadingSpinner";
import Link from "next/link";
import { Button, Input } from "@/modules/common/components/ui";

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
    } catch {
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
            <Input
              label="Kullanıcı Adı"
              type="text"
              autoComplete="username"
              placeholder="Kullanıcı adınızı giriniz"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Şifre"
              type="password"
              autoComplete="current-password"
              placeholder="Şifrenizi giriniz (en az 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <Button
            type="submit"
            disabled={isSubmitting}
            fullWidth
            isLoading={isSubmitting}
            variant={"primary"}
            size="lg"
            className="mt-6"
          >
            {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </Button>

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
