import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  ArrowLeft01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-primary-50 via-white to-gray-100 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-10 shadow-xl">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <HugeiconsIcon icon={LockIcon} size={40} color="#dc2626" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-center text-4xl font-bold text-gray-900">
          403
        </h1>

        <h2 className="mt-2 text-center text-xl font-semibold text-gray-800">
          Access Denied
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-500">
          You don't have permission to access this page.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            Go Back
          </button>

          <Link
            to="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            <HugeiconsIcon icon={Home01Icon} size={18} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
