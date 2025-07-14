// src/context/DataProvider.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { useBackgroundCleanup } from "../hooks/useBackgroundCleanup";

// Define the shape of an expense record
export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string; // ISO date string
  description?: string;
}

// Context type: provides current expenses and a function to add new ones
interface DataContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
}

// Create the context with default (empty) values
const DataContext = createContext<DataContextType>({
  expenses: [],
  addExpense: () => {},
});

// Mock data used on first load, if no saved data exists
const mockExpenses: Expense[] = [
  {
    id: "1",
    category: "Food",
    amount: 25,
    date: "2025-07-14",
    description: "Lunch",
  },
  {
    id: "2",
    category: "Transport",
    amount: 15,
    date: "2025-07-13",
    description: "Uber ride",
  },
  {
    id: "3",
    category: "Entertainment",
    amount: 50,
    date: "2025-07-12",
    description: "Movie ticket",
  },
  {
    id: "4",
    category: "Utilities",
    amount: 40,
    date: "2025-07-11",
    description: "Electric bill",
  },
  {
    id: "5",
    category: "Health",
    amount: 30,
    date: "2025-07-10",
    description: "Pharmacy",
  },
];

// DataProvider component that wraps the app
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Load from localStorage or fall back to mock data
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = localStorage.getItem("expenses");
    return stored ? JSON.parse(stored) : mockExpenses;
  });

  // Cleanup expired entries (older than 30 days) when browser is idle
  useBackgroundCleanup(expenses, {
    expireDays: 30,
    onCleanup: (expiredIds) => {
      setExpenses((prev) => prev.filter((e) => !expiredIds.includes(e.id)));
    },
  });


  // Persist to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);



  // Function to add a new expense
  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  return (
    <DataContext.Provider value={{ expenses, addExpense }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to consume the context
export const useData = () => useContext(DataContext);
