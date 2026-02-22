export type TransactionType = "income" | "expense";
export type AppView =
  | "landing"
  | "dashboard"
  | "analytics"
  | "goals"
  | "login"
  | "register"
  | "settings";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Summary {
  balance: number;
  income: number;
  expense: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}
