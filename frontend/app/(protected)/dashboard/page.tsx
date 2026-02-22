"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  AppView,
  Goal,
  Notification,
  Transaction,
  TransactionType,
  Summary,
} from "@/types";
import Sidebar from "@/components/Sidebar";
// import SummaryCards from "@/components/SummaryCards";
// import TransactionForm from "@/components/TransactionForm";
// import TransactionList from "@/components/TransactionList";
// import AIInsights from "@/components/AIInsights";
import NotificationToast from "@/components/NotificationToast";
import Modal from "@/components/Modal";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [view, setView] = useState<AppView>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    const savedGoals = localStorage.getItem("goals");

    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
    setGoals(
      savedGoals
        ? JSON.parse(savedGoals)
        : [
            {
              id: "1",
              name: "MacBook Pro M3",
              targetAmount: 100000,
              currentAmount: 45000,
            },
          ],
    );
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals, mounted]);

  const summary: Summary = transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount);
      if (t.type === "income") {
        acc.income += amount;
        acc.balance += amount;
      } else {
        acc.expense += amount;
        acc.balance -= amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expense: 0 },
  );

  const addNotification = (
    message: string,
    type: "success" | "info" | "error" = "info",
  ) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addTransaction = (
    description: string,
    amount: number,
    type: TransactionType,
    category: string,
  ) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount,
      type,
      category,
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    addNotification("Транзакцію успішно додано", "success");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    addNotification("Транзакцію видалено", "info");
  };

  const renderDashboardContent = () => {
    switch (view) {
      case "analytics":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center py-20">
              <h2 className="text-xl font-light text-gray-900 mb-2">
                Детальна аналітика
              </h2>
              <p className="text-sm text-gray-400 font-light max-w-sm mx-auto">
                Функція в розробці. Ми готуємо для вас найкращі графіки для
                аналізу ваших фінансів.
              </p>
            </div>
          </div>
        );
      case "goals":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-gray-900">
                Ваші фінансові цілі
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all"
              >
                Нова ціль
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-900">{goal.name}</h3>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                      {Math.round(
                        (goal.currentAmount / goal.targetAmount) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>₴{goal.currentAmount.toLocaleString()}</span>
                      <span>₴{goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full transition-all duration-1000"
                        style={{
                          width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
            <h2 className="text-xl font-light text-gray-900 mb-8 px-4">
              Налаштування профілю
            </h2>
            <div className="space-y-6 max-w-md">
              <div className="px-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-2">
                  Валюта за замовчуванням
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm">
                  <option>Українська гривня (₴)</option>
                  <option>Долар США ($)</option>
                  <option>Євро (€)</option>
                </select>
              </div>
              <div className="px-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 block mb-2">
                  Тема оформлення
                </label>
                <div className="flex space-x-4">
                  <button className="flex-1 py-3 bg-white border border-black rounded-xl text-xs font-bold uppercase tracking-widest">
                    Світла
                  </button>
                  <button className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-xl text-xs font-bold uppercase tracking-widest">
                    Темна
                  </button>
                </div>
              </div>
              <div className="pt-6 px-4">
                <button
                  onClick={() =>
                    addNotification("Налаштування збережено", "success")
                  }
                  className="w-full py-4 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-black/10"
                >
                  Зберегти зміни
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in">
            <div className="xl:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* <AIInsights transactions={transactions} />
                <TransactionForm onAdd={addTransaction} /> */}
              </div>
              {/* <TransactionList
                transactions={transactions}
                onDelete={deleteTransaction}
              /> */}
            </div>
            <div className="xl:col-span-4 space-y-8">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                  Аналіз категорій
                </h3>
                <div className="space-y-5">
                  {["Їжа", "Транспорт", "Житло", "Розваги"].map((name, idx) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">
                          {name}
                        </span>
                        <span className="font-bold text-gray-900">
                          {[65, 40, 25, 15][idx]}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-black rounded-full transition-all duration-1000`}
                          style={{ width: `${[65, 40, 25, 15][idx]}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="bg-black text-white p-8 rounded-3xl shadow-xl shadow-black/10 relative overflow-hidden group cursor-pointer"
                onClick={() => setView("goals")}
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Накопичення
                </h3>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-light">
                    MacBook Pro M3
                  </p>
                  <p className="text-3xl font-light tracking-tighter">
                    ₴45,000
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                    <span>Прогрес</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-black selection:text-white">
      <Sidebar
        currentView={view}
        onViewChange={setView}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSignOut={() => {
          logout();
        }}
      />

      <NotificationToast
        notifications={notifications}
        onClose={removeNotification}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Нова фінансова ціль"
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
            addNotification("Ціль успішно створено", "success");
          }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Назва цілі"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm"
            />
            <input
              type="number"
              placeholder="Сума (₴)"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm"
            />
            <input
              type="date"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all text-sm text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/10"
          >
            Додати ціль
          </button>
        </form>
      </Modal>

      <main className="lg:ml-64 p-6 md:p-12 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500"
              >
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-light tracking-tight text-gray-900">
                  {view === "dashboard"
                    ? "Головна панель"
                    : view === "analytics"
                      ? "Аналітика"
                      : view === "goals"
                        ? "Фінансові цілі"
                        : "Налаштування"}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">
                  Сьогодні
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {new Date().toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <button
                onClick={() =>
                  addNotification("У вас немає нових сповіщень", "info")
                }
                className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-black transition-colors"
              >
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </div>
          </header>

          <div className="space-y-8">
            {/* <SummaryCards summary={summary} /> */}
            {renderDashboardContent()}
          </div>

          <footer className="mt-20 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-300 uppercase tracking-[0.2em] space-y-4 md:space-y-0">
            <span>Dashboard v1.0.5 — Verified Session</span>
            <div className="flex space-x-8">
              <button className="hover:text-black transition-colors">
                Documentation
              </button>
              <button className="hover:text-black transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-black transition-colors">
                Support
              </button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
