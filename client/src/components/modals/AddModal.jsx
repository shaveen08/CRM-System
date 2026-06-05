import React, { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import useNotification from "../../utils/useNotification";

const AddModal = ({ isOpen, onClose, data, dispatch, fields, addAction, triggerNotification, }) => {
  const getNextId = () => (data.length > 0 ? data[data.length - 1].id + 1 : 1);

  const getInitialForm = () => ({
    id: getNextId(),
    ...fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}),
  });

  const [formData, setFormData] = useState(getInitialForm);
  const modalRef = useRef();

  React.useEffect(() => {
    if (isOpen) setFormData(getInitialForm());
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const createdDate = new Date().toISOString().split("T")[0];
    dispatch(
      addAction({
        ...formData,
        createdAt: createdDate,
        ...(fields.some((f) => f.name === "lastContacted") && {
          lastContacted: createdDate,
        }),
      }),
    );
    setFormData(getInitialForm());
    triggerNotification({
      type: "success",
      message: "Record added successfully!",
      duration: 3000,
    });
    onClose();
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
            <h4 className="text-base font-semibold text-gray-800">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {fields.map((field) =>
              field.type === "select" ? (
                <select
                  key={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500 text-gray-700"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  required
                  className="h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-primary-500"
                />
              ),
            )}

            {/*  Actions */}
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
