
import { type ToastProps } from "@/components/ui/toast"
import {
  toast as sonnerToast,
  type ToastT, // Use the correct type export from sonner
} from "sonner"

type ExternalToast = ToastT;

export const toast = Object.assign(
  (props: {
    title?: React.ReactNode
    description?: React.ReactNode
    variant?: "default" | "destructive" | "warning"
    duration?: number
    action?: {
      label: string
      onClick: () => void
      altText: string
    }
    cancel?: {
      label: string
      onClick: () => void
      altText: string
    },
    [key: string]: any
  }) => {
    const { title, description, variant, action, cancel, ...restProps } = props

    const options = {
      className: variant === "destructive" ? "destructive" : "",
      duration: restProps.duration,
      ...restProps,
    }

    if (action && cancel) {
      return sonnerToast(title as string, {
        description,
        action: {
          label: action.label,
          onClick: action.onClick,
        },
        cancel: {
          label: cancel.label,
          onClick: cancel.onClick,
        },
        ...options,
      })
    }

    if (action) {
      return sonnerToast(title as string, {
        description,
        action: {
          label: action.label,
          onClick: action.onClick,
        },
        ...options,
      })
    }

    return sonnerToast(title as string, {
      description,
      ...options,
    })
  },
  {
    success: (props: { title?: React.ReactNode, description?: React.ReactNode, duration?: number }) => {
      return toast({ ...props, variant: "default" })
    },
    error: (props: { title?: React.ReactNode, description?: React.ReactNode, duration?: number }) => {
      return toast({ ...props, variant: "destructive" })
    },
    warn: (props: { title?: React.ReactNode, description?: React.ReactNode, duration?: number }) => {
      return toast({ ...props })
    },
    info: (props: { title?: React.ReactNode, description?: React.ReactNode, duration?: number }) => {
      return toast({ ...props })
    },
    message: (props: { title?: React.ReactNode, description?: React.ReactNode, variant?: "default" | "destructive" | "warning", duration?: number }) => {
      return toast(props)
    },
    promise: sonnerToast.promise,
    dismiss: (toastId?: string) => {
      sonnerToast.dismiss(toastId)
    },
    custom: sonnerToast.custom,
  }
)

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    altText: string
  }
  variant?: "default" | "destructive" | "warning"
}

// This is the provider we need to wrap the app with
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return children
}

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
  }
}
