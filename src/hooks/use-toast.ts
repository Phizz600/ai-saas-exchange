
import React, { useState, createContext, useContext, useEffect } from "react";

// Types
export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (id: string) => void;
  // Add toast function to context
  toast: (props: Omit<ToastProps, "id">) => void;
};

// Create a context for the toast
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Generate a unique ID for each toast
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Toast provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Add a new toast
  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = generateId();
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 5000);
  };

  // Remove a toast by ID
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Create toast function directly in context
  const toast = (props: Omit<ToastProps, "id">) => {
    addToast(props);
  };

  // Initialize the toast handler when the provider mounts
  useEffect(() => {
    setToastHandler(addToast);
    return () => setToastHandler(null);
  }, []);

  // Create provider without using JSX
  return React.createElement(
    ToastContext.Provider, 
    { value: { toasts, addToast, removeToast, toast } },
    children
  );
};

// Hook to use the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Standalone toast function (for use outside of React components)
let toastHandler: ((toast: Omit<ToastProps, "id">) => void) | null = null;

export const setToastHandler = (handler: (toast: Omit<ToastProps, "id">) => void) => {
  toastHandler = handler;
};

export const toast = (props: Omit<ToastProps, "id">) => {
  if (toastHandler) {
    toastHandler(props);
  } else {
    console.warn("Toast handler not initialized. Make sure to use ToastProvider.");
  }
};
