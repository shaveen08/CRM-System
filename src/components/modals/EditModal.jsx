import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { formConfig } from "../../config/formFields";
import DynamicField from "../from/DynamicField";

const EditModal = ({
  isOpen,
  onClose,
  module,
  record,
  onSuccess,
  triggerNotification,
}) => {
  const config = formConfig[module];

  const fields = config.fields;
  const endpoint = config.endpoint;
  const title = config.title;

  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...(prev[name] || []), value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    const { _id, __v, createdAt, updatedAt, ...payload } = formData;

    try {
      await api.put(`${endpoint}/${_id}`, payload);

      triggerNotification?.({
        type: "info",
        message: `${title} updated successfully!`,
        duration: 3000,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);

      triggerNotification?.({
        type: "error",
        message: "Failed to update record",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !record) return null;

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
              Edit {title}
            </h4>

            <p className="text-sm text-gray-500">
              Update the information below
            </p>
          </div>

          <div
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white hover:bg-gray-100"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6b7280" />
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.colSpan === 12 ? "md:col-span-2" : ""}
              >
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-xs font-medium text-gray-600"
                >
                  {field.label}
                </label>

                <DynamicField
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 md:col-span-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
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
