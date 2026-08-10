import React, { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { formConfig } from "../../config/formFields";
import DynamicField from "../from/DynamicField";
import api from "../../api/axios";

const AddModal = ({
  isOpen,
  onClose,
  module,
  onSuccess,
  triggerNotification,
}) => {
  // dynamic form config file
  const config = formConfig[module];

  const fields = config.fields;
  const endpoint = config.endpoint;
  const title = config.title;

  const initialForm = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {});
  }, [fields]);

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setFormData(initialForm);
    }
  }, [isOpen, initialForm]);

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
    console.log(leadData)//--------------------------------------//
    try {
      await api.post(endpoint, leadData);

      triggerNotification?.({
        type: "success",
        message: "Added successfully!",
        duration: 3000,
      });
      setFormData(initialForm);
      onSuccess?.();
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
