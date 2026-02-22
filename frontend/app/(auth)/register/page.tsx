"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/services/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.register({ name, email, password });
      login(response.access_token, response.user);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Помилка реєстрації. Спробуйте ще раз.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="text-2xl font-light tracking-tighter mb-8 cursor-pointer inline-block"
          >
            FinTrack
          </Link>
          <h1 className="text-3xl font-light tracking-tight">
            Створити аккаунт
          </h1>
          <p className="text-sm text-gray-400 font-light">
            Приєднуйтесь до 10,000+ користувачів
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm disabled:opacity-50"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/5 disabled:opacity-50"
          >
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-400 font-light">
            Вже маєте аккаунт?{" "}
            <Link
              href="/login"
              className="text-black font-medium hover:underline"
            >
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
