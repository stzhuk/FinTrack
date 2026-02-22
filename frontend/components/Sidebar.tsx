"use client";

import React from "react";
import { AppView } from "@/types";

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isOpen: boolean;
  onToggle: () => void;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onToggle,
  onSignOut,
}) => {
  const navItems: { id: AppView; label: string; icon: string }[] = [
    {
      id: "dashboard",
      label: "Огляд",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "analytics",
      label: "Аналітика",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    { id: "goals", label: "Цілі", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    {
      id: "settings",
      label: "Налаштування",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      <div
        className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-50 transition-transform duration-300 ease-in-out
        w-72 p-8 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:w-64
      `}
      >
        <div className="mb-12 flex items-center justify-between">
          <div
            className="cursor-pointer"
            onClick={() => onViewChange("landing")}
          >
            <h2 className="text-xl font-light tracking-tighter">FinTrack</h2>
          </div>
          <button onClick={onToggle} className="lg:hidden p-1 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-4 px-2">
              Меню
            </p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  if (typeof window !== "undefined" && window.innerWidth < 1024)
                    onToggle();
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-3 transition-all ${
                  currentView === item.id
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="pt-8 border-t border-gray-50 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
              UA
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Користувач</p>
              <p className="text-[10px] text-gray-400">Premium Plan</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-rose-500 transition-colors text-xs"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Вийти</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
