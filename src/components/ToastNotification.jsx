import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Alert01Icon,
  RssErrorIcon,
  InformationCircleIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

const positionStyles = {
  "top-right": "top-5 right-5",
  "top-left": "top-5 left-5",
  "bottom-right": "bottom-5 right-5",
  "bottom-left": "bottom-5 left-5",
  "top-center": "top-5 left-1/2 -translate-x-1/2",
};

const ToastNotification = ({ type, message, onClose, position }) => {
  const icons = {
    success: <HugeiconsIcon icon={Tick02Icon} />,
    info: <HugeiconsIcon icon={InformationCircleIcon} />,
    warning: <HugeiconsIcon icon={Alert01Icon} />,
    error: <HugeiconsIcon icon={RssErrorIcon} />,
  };

  const styles = {
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div
      className={`fixed z-9999 flex min-w-[320px] items-center justify-between 
        rounded-lg border px-4 py-3 shadow-lg 
        ${positionStyles[position]} ${styles[type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose}>
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>
    </div>
  );
};

export default ToastNotification;
