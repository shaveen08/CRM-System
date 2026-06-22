import React, { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import axios from "axios";

const AddModal = ({
  isOpen,
  onClose,
  fields,
  endpoint, // API endpoint this modal posts to — makes the modal reusable across modules
  onSuccess, // called after a successful save, so the parent (e.g. Tabel) can refetch its list
  triggerNotification,
}) => {
  const initialForm = useMemo(
    () =>
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: "",
        }),
        {},
      ),
    [fields],
  );

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setFormData(initialForm);
    }
  }, [isOpen, initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!endpoint) {
      triggerNotification?.({
        type: "error",
        message: "API endpoint not provided",
        duration: 3000,
      });
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    const createdDate = new Date().toISOString().split("T")[0];

    const leadData = {
      ...formData,
      createdAt: createdDate,
      ...(fields.some((f) => f.name === "lastContacted") && {
        lastContacted: createdDate,
      }),
    };

    try {
      // POST directly to the endpoint passed in — e.g. "http://localhost:5000/api/leads"
      // No hardcoded URL here, so this modal works for any module just by
      // changing the endpoint/fields props.
      await axios.post(endpoint, leadData);

      triggerNotification?.({
        type: "success",
        message: "Added successfully!",
        duration: 3000,
      });
      setFormData(initialForm);
      onSuccess?.(); // tells the parent to refetch its table data
      onClose();
    } catch (err) {
      console.error("Add failed:", err.response?.data || err.message);
      triggerNotification?.({
        type: "error",
        message: "Failed to add record",
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
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-primary-50 p-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-800">
              Add Record
            </h4>
            <p className="text-sm text-gray-500">
              Fill in the information below
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
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
