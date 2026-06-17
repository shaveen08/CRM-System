import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/actions/modulesAction";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

const MODULES = ["Dashboard", "Contacts", "Activity", "Appointments", "Users"];
const PERMISSIONS = ["Read", "Write", "Update", "Delete"];

// Build initial access state from existing user data
const buildAccessState = (user) => {
  return Object.fromEntries(
    MODULES.map((m) => {
      const existingModule = user?.modulePermissions?.find(
        (mp) => mp.module === m,
      );
      return [
        m,
        {
          checked: !!existingModule,
          perms: Object.fromEntries(
            PERMISSIONS.map((p) => [
              p,
              existingModule?.permissions?.includes(p) ?? false,
            ]),
          ),
        },
      ];
    }),
  );
};

const UserEdit = ({ user, onBack, triggerNotification }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "",
  });

  const [access, setAccess] = useState(() => buildAccessState(user));

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleModule = (mod) => {
    setAccess((prev) => ({
      ...prev,
      [mod]: {
        checked: !prev[mod].checked,
        perms: !prev[mod].checked
          ? prev[mod].perms
          : Object.fromEntries(PERMISSIONS.map((p) => [p, false])),
      },
    }));
  };

  const togglePerm = (mod, perm) => {
    setAccess((prev) => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        perms: { ...prev[mod].perms, [perm]: !prev[mod].perms[perm] },
      },
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.role) {
      triggerNotification?.("error", "Please fill all required fields.");
      return;
    }

    const accessList = MODULES.filter((m) => access[m].checked).map((m) => ({
      module: m,
      permissions: PERMISSIONS.filter((p) => access[m].perms[p]),
    }));

    dispatch(
      updateUser({
        ...user,
        name: form.name,
        email: form.email,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
        access: accessList.map((a) => a.module),
        modulePermissions: accessList,
      }),
    );

    triggerNotification?.(
      "success",
      `User "${form.name}" updated successfully.`,
    );
    onBack();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Users
        </button>
        <p className="text-xs text-gray-400">
          Users / <span className="text-gray-700 font-medium">Edit User</span>
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-1">
        {/* Basic Info */}
        <section className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Basic Information
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Full name",
                name: "name",
                type: "text",
                placeholder: "Rajesh Kumar",
                required: true,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "rajesh@company.com",
                required: true,
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                placeholder: "Leave blank to keep current",
                required: false,
              },
            ].map(({ label, name, type, placeholder, required }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleFormChange}
                  placeholder={placeholder}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary-700 bg-gray-50"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleFormChange}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary-700 bg-gray-50 text-gray-700"
              >
                <option value="">Select role</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Sales Rep</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>
        </section>

        {/* Module Access */}
        <section className="w-full bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Module Access & Permissions
          </p>

          <div className="w-full border border-gray-100 rounded-xl overflow-hidden">
            {/* Table header */}
            <div
              className="grid bg-gray-50 border-b border-gray-100 px-4 py-2.5"
              style={{ gridTemplateColumns: "1fr repeat(4, auto)" }}
            >
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Module
              </span>
              {PERMISSIONS.map((p) => (
                <span
                  key={p}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-20 text-center"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Module rows */}
            {MODULES.map((mod, i) => {
              const isChecked = access[mod].checked;
              return (
                <div
                  key={mod}
                  className={`grid px-4 items-center transition-colors ${
                    i !== MODULES.length - 1 ? "border-b border-gray-100" : ""
                  } ${isChecked ? "bg-primary-50/40" : "bg-white hover:bg-gray-50"}`}
                  style={{ gridTemplateColumns: "1fr repeat(4, auto)" }}
                >
                  <label className="flex items-center gap-3 py-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleModule(mod)}
                      className="h-3.5 w-3.5 accent-primary-700 cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium ${isChecked ? "text-primary-700" : "text-gray-600"}`}
                    >
                      {mod}
                    </span>
                  </label>

                  {PERMISSIONS.map((perm) => (
                    <div key={perm} className="w-20 flex justify-center">
                      {isChecked ? (
                        <input
                          type="checkbox"
                          checked={access[mod].perms[perm]}
                          onChange={() => togglePerm(mod, perm)}
                          className="h-3.5 w-3.5 accent-primary-700 cursor-pointer"
                        />
                      ) : (
                        <span className="h-3.5 w-3.5 block rounded-sm bg-gray-100" />
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        <div className="h-2" />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 pt-4 flex justify-end gap-3">
        <button
          onClick={onBack}
          className="text-sm font-medium px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="text-sm font-medium px-5 py-2 rounded-lg bg-primary-700 hover:bg-primary-800 text-white transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserEdit;
