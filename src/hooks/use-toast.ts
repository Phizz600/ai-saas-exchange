
import { type ToastProps, type ToastActionElement, type ToastActionProps } from "@/components/ui/toast"
import {
  toast as sonnerToast,
  ToastT,
} from "sonner"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  cancel?: ToastActionElement
}

const actionPropsToToastAction = (props: ToastActionProps): ToastActionElement => {
  const { altText, ...actionProps } = props
  return {
    altText,
    ...actionProps,
  }
}

export const toast = Object.assign(
  (props: ToastProps) => {
    const { title, description, variant, action, cancel, ...restProps } = props

    // Transform toast action props to toast action if needed
    let actionElement = action
    if (action && "altText" in action) {
      actionElement = actionPropsToToastAction(action as ToastActionProps)
    }

    let cancelElement = cancel
    if (cancel && "altText" in cancel) {
      cancelElement = actionPropsToToastAction(cancel as ToastActionProps)
    }

    const toastOptions = {
      className: variant === "destructive" ? "destructive" : "",
      ...restProps,
    }

    if (actionElement && cancelElement) {
      return sonnerToast(title as string, {
        description,
        action: actionElement,
        cancel: cancelElement,
        ...toastOptions,
      })
    }

    if (actionElement) {
      return sonnerToast(title as string, {
        description,
        action: actionElement,
        ...toastOptions,
      })
    }

    return sonnerToast(title as string, {
      description,
      ...toastOptions,
    })
  },
  {
    success: (props: Omit<ToastProps, "variant">) => {
      return toast({ ...props, variant: "default" })
    },
    error: (props: Omit<ToastProps, "variant">) => {
      return toast({ ...props, variant: "destructive" })
    },
    warn: (props: Omit<ToastProps, "variant">) => {
      return toast({ ...props })
    },
    info: (props: Omit<ToastProps, "variant">) => {
      return toast({ ...props })
    },
    message: (props: ToastProps) => {
      return toast(props)
    },
    promise: sonnerToast.promise,
    dismiss: (toastId?: string) => {
      sonnerToast.dismiss(toastId)
    },
    update: (toastId: string, props: ToastProps) => {
      const { title, description, variant, action, cancel, ...restProps } = props

      let actionElement = action
      if (action && "altText" in action) {
        actionElement = actionPropsToToastAction(action as ToastActionProps)
      }

      let cancelElement = cancel
      if (cancel && "altText" in cancel) {
        cancelElement = actionPropsToToastAction(cancel as ToastActionProps)
      }

      const toastOptions = {
        className: variant === "destructive" ? "destructive" : "",
        ...restProps,
      }

      if (actionElement && cancelElement) {
        return sonnerToast.update(toastId, title as string, {
          description,
          action: actionElement,
          cancel: cancelElement,
          ...toastOptions,
        })
      }

      if (actionElement) {
        return sonnerToast.update(toastId, title as string, {
          description,
          action: actionElement,
          ...toastOptions,
        })
      }

      return sonnerToast.update(toastId, title as string, {
        description,
        ...toastOptions,
      })
    },
  }
)

export type Toast = ToasterToast

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    update: toast.update,
  }
}
