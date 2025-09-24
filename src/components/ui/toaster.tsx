
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      className="toaster group" 
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:text-black group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-black group-[.toast]:border group-[.toast]:border-gray-200 group-[.toast]:hover:bg-gray-200",
          cancelButton:
            "group-[.toast]:bg-gray-50 group-[.toast]:text-gray-600 group-[.toast]:border group-[.toast]:border-gray-200 group-[.toast]:hover:bg-gray-100",
        },
      }}
    />
  );
}
