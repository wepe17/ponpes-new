import { useState, useEffect } from "react";

export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (toast) {
      timer = setTimeout(() => {
        setToast(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [toast]);

  const ToastComponent = () => {
    if (!toast) return null;

    const typeStyles = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    };

    return (
      <div
        className={`fixed top-4 right-4 px-4 py-2 text-white rounded ${typeStyles[toast.type]} transition-all`}
      >
        {toast.message}
      </div>
    );
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setToast({ message, type, visible: true });
  };

  return {
    showToast,
    ToastComponent,
  };
};
