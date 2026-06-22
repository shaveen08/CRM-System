import React, { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import axios from "axios";

const DeleteModal = ({
  isOpen,
  onClose,
  deleteID,
  endpoint,
  onSuccess,
  triggerNotification,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef();

  const handleConfirmDelete = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await axios.delete(`${endpoint}/${deleteID}`);
      triggerNotification?.({
        type: "warning",
        message: "Record deleted successfully!",
        duration: 3000,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      triggerNotification?.({
        type: "error",
        message: "Failed to delete record",
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
      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-red-50 p-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-800">
              Delete Record
            </h4>
            <p className="text-sm text-gray-500">
              This action cannot be undone
            </p>
          </div>
          <div
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:bg-gray-100 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6b7280" />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <HugeiconsIcon icon={Delete02Icon} size={26} color="#cd0000" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">
              Are you sure you want to delete this record?
            </p>
            <p className="text-sm text-gray-400 mt-1">
              This will permanently remove it from your list.
            </p>
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={submitting}
              className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
