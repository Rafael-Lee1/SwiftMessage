
export interface ToastAPI {
  toast: (props: any) => void;
  dismiss: (toastId?: string) => void;
}
