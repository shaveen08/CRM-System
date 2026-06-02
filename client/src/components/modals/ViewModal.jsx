import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";

const ViewModal = ({ isOpen, onClose, lead, onEdit }) => {
  if (!isOpen || !lead) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-primary-50 p-4">
          <div>
            <h4 className="text-base font-semibold text-gray-800">
              Lead Details
            </h4>
            <p className="text-sm text-gray-500">Read-only overview</p>
          </div>
          <div
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:bg-gray-100 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6b7280" />
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
          <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-lg font-semibold text-purple-700 shrink-0">
            {lead.name?.[0]}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-800">{lead.name}</p>
            <span
              className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
                lead.status === "Completed" || lead.status === "Active"
                  ? "bg-green-50 text-green-700"
                  : lead.status === "Dropped" || lead.status === "Blocked"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {lead.status}
            </span>
          </div>
        </div>

        {/* Details — renders all keys except id, name, status dynamically */}
        <div className="px-5 py-3 flex flex-col divide-y divide-gray-100">
          {Object.entries(lead)
            .filter(([key]) => !["id", "name", "status"].includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500 capitalize">
                  {key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </span>
                <span
                  className={`text-sm font-medium ${
                    key === "dealValue" || key === "amount"
                      ? "text-green-600 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {key === "dealValue" || key === "amount"
                    ? `₹${value}`
                    : value || "-"}
                </span>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 rounded-lg bg-primary-700 py-2 text-sm font-medium text-white hover:bg-primary-800 flex items-center justify-center gap-1.5"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={15} color="#fff" />
            Edit Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
