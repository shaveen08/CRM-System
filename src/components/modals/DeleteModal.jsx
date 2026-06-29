import React, { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import api from "../../api/axios";
import { formConfig } from "../../config/formFields";

const DeleteModal = ({
  isOpen,
  onClose,
  module,
  deleteID,
  onSuccess,
  triggerNotification,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef();

  // Dynamic config
  const config = formConfig[module];

  if (!config) return null;

  const { endpoint, title } = config;

  const handleConfirmDelete = async () => {
    if (submitting) return;

    setSubmitting(true);

    try {
      await api.delete(`${endpoint}/${deleteID}`);

      triggerNotification?.({
        type: "warning",
        message: `${title} deleted successfully!`,
        duration: 3000,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);

      triggerNotification?.({
        type: "error",
        message: `Failed to delete ${title.toLowerCase()}`,
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-red-50 p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Delete {title}
            </h3>

            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white transition"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6b7280" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <HugeiconsIcon icon={Delete02Icon} size={32} color="#dc2626" />
          </div>

          <h4 className="mt-5 text-lg font-semibold text-gray-800">
            Delete {title}?
          </h4>

          <p className="mt-2 text-center text-sm text-gray-500">
            Are you sure you want to delete this{" "}
            <span className="font-medium">{title.toLowerCase()}</span>?
          </p>

          <p className="text-center text-sm text-gray-400 mt-1">
            This action cannot be reversed.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex w-full gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmDelete}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
