"use client";

import React, { useEffect } from "react";
import { Notification } from "@/types";

interface NotificationToastProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-100 space-y-3 pointer-events-none">
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onClose={() => onClose(n.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    notification.type === "success"
      ? "bg-black"
      : notification.type === "error"
        ? "bg-rose-600"
        : "bg-gray-800";

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between min-w-75 animate-slide-up pointer-events-auto`}
    >
      <span className="text-sm font-medium tracking-tight">
        {notification.message}
      </span>
      <button
        onClick={onClose}
        className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default NotificationToast;
