import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isFooter?: boolean;
  onOk?: () => void;
  width?: string; // Custom width (e.g., "w-96", "w-full")
  height?: string; // Custom height (e.g., "h-auto", "h-96")
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isFooter = false,
  onOk,
  width = "w-[599px]", // Default width
  height = "h-auto", // Default height
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Background Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          onClick={onClose}
        />

        <div
          className={`relative inline-block ${width} ${height} p-6 my-8 text-left bg-white rounded-lg shadow-xl transform transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-2">{children}</div>

          {/* Footer */}
          {isFooter && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={onOk}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
