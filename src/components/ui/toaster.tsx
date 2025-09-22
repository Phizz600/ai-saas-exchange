
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      className="toaster group" 
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/10 group-[.toaster]:backdrop-blur-lg group-[.toaster]:border group-[.toaster]:border-white/20 group-[.toaster]:text-white group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/10",
          description: "group-[.toast]:text-white/80",
          actionButton:
            "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:border group-[.toast]:border-white/30 group-[.toast]:hover:bg-white/30",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/70 group-[.toast]:border group-[.toast]:border-white/20 group-[.toast]:hover:bg-white/20",
        },
      }}
    />
  );
}
