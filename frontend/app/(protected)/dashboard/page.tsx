"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-light tracking-tight">Dashboard</h1>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            Вийти
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Профіль
          </p>
          <p className="text-lg text-gray-900">{user?.name ?? "-"}</p>
          <p className="text-sm text-gray-500">{user?.email ?? "-"}</p>
        </div>
      </div>
    </div>
  );
}
