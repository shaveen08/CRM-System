import React from "react";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-primary-500";

const textareaClass =
  "w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-primary-500 resize-none";

const DynamicField = ({ field, value, onChange }) => {
  switch (field.type) {
    // ==========================
    // INPUT TYPES
    // ==========================
    case "text":
    case "email":
    case "password":
    case "number":
    case "tel":
    case "date":
    case "datetime-local":
      return (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={field.placeholder || field.label}
          required={field.required}
          className={inputClass}
        />
      );

    // ==========================
    // SELECT
    // ==========================
    case "select":
      return (
        <select
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={onChange}
          required={field.required}
          className={inputClass}
        >
          <option value="">Select {field.label}</option>

          {field.options?.map((option) => (
            <option
              key={typeof option === "object" ? option.value : option}
              value={typeof option === "object" ? option.value : option}
            >
              {typeof option === "object" ? option.label : option}
            </option>
          ))}
        </select>
      );

    // ==========================
    // TEXTAREA
    // ==========================
    case "textarea":
      return (
        <textarea
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={field.placeholder || field.label}
          required={field.required}
          rows={4}
          className={textareaClass}
        />
      );

    // ==========================
    // CHECKBOX GROUP
    // ==========================
    case "checkbox":
      return (
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-300 p-4">
          {field.options?.map((option) => {
            const optionValue =
              typeof option === "object" ? option.value : option;

            const optionLabel =
              typeof option === "object" ? option.label : option;

            return (
              <label
                key={optionValue}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={field.name}
                  value={optionValue}
                  checked={(value || []).includes(optionValue)}
                  onChange={onChange}
                  className="h-4 w-4 accent-primary-600"
                />

                <span className="text-sm text-gray-700">{optionLabel}</span>
              </label>
            );
          })}
        </div>
      );

    default:
      return null;
  }
};

export default DynamicField;
