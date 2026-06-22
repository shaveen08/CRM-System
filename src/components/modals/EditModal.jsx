import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import axios from "axios";

const EditModal = ({
  isOpen,
  onClose,
  lead,
  fields,
  endpoint,
  onSuccess,
  triggerNotification,
}) => {
  const [formData, setFormData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (lead) setFormData({ ...lead });
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting state:", submitting);
    console.log("formData:", formData);
    if (submitting) return;

    setSubmitting(true);

    // Strip internal Mongo fields before sending
    const { _id, __v, createdAt, updatedAt, ...payload } = formData;

    try {
      await axios.put(`${endpoint}/${formData._id}`, payload);
      console.log("trigger fn:", triggerNotification);
      console.log("about to trigger notification");

      triggerNotification?.({
        type: "info",
        message: "Record updated successfully!",
        duration: 3000,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      triggerNotification?.({
        type: "error",
        message: "Failed to update record",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div
      ref={modalRef}
      onClick={(e) => {
        if (e.target === modalRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-primary-50 p-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-800">
              Edit Record
            </h4>
            <p className="text-sm text-gray-500">
              Update the information below
            </p>
          </div>
          <div
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:bg-gray-100 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6b7280" />
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-xs font-medium text-gray-600 mb-1.5"
                >
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required
                    className="h-11 w-full text-sm border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500 text-gray-700"
                  >
                    <option value="" disabled>
                      Select {field.label}
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.label}
                    required
                    className="h-11 w-full text-sm border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                  />
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
