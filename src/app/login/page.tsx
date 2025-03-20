"use client";
import { AuthForm } from "@/modules/auth/components/AuthForm";

export default function Login() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
