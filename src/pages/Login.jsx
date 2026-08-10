import loginBg from "../assets/images/login_bg1.jpg";
import googleIcon from "../assets/icons/google_icon.svg";
import appleIcon from "../assets/icons/apple_icon.svg";
import loginIllustration from "../assets/images/login_illustration.svg";
import loadingSpinner from "../assets/icons/spinner.svg";
import { AppleIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Login = () => {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validation --------------------------------------------------------------------------------------------------------------------------- /
  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Field cannot be blank.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Field cannot be blank.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        values.password,
      )
    ) {
      errors.password =
        "Password must be 8+ characters and include uppercase, lowercase, number, and special character.";
    }

    return errors;
  };

  // Form Submit --------------------------------------------------------------------------------------------------------------------------- /
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          values,
        );

        if (response.data.user.status !== "Active") {
          setError({
            auth: "Your account is deactivated. Contact administrator.",
          });
          return;
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("loggedUser", JSON.stringify(response.data.user));

        setError({});
        resetForm();

        navigate("/dashboard");
      } catch (err) {
        console.error(err);

        setError({
          auth: "Something went wrong. Try again.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleChange = (e) => {
    formik.handleChange(e);
    if (error.auth) setError({});
  };

  return (
    <main
      className="h-screen w-full flex justify-between items-center bg-center bg-cover contain-content p-4"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Login content */}
      <div className="h-full text-white m-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">CRM System</h1>
        </div>
        <img src={loginIllustration} className="h-95" alt="" />
        <div className="mb-15">
          <h1 className="text-4xl mb-1">
            The simplest way to manage your workspaces
          </h1>
          <p>Enter your credential to access your account.</p>
        </div>
      </div>

      {/* Login */}
      <div className="w-1/3 h-full flex flex-col justify-between items-center px-6 py-6 bg-white rounded-lg">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md flex flex-col gap-4"
        >
          {/* Header */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Nice to see you again!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your details to access your account.
            </p>

            {error.auth && (
              <span className="text-red-600 text-sm mt-1 block">
                {error.auth}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="myname@example.com"
              value={formik.values.email}
              autoComplete="off"
              onChange={handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={`${loading ? "cursor-not-allowed" : ""} h-11 px-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-900`}
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-600 text-xs mt-1 ml-2">
                {formik.errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Myname@123"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
              className={`${loading ? "cursor-not-allowed" : ""} h-11 px-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-900`}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-600 text-xs mt-1 ml-2">
                {formik.errors.password}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className={`h-11 mt-2 gap-2 text-white font-medium rounded-lg transition flex items-center justify-center
              ${
                loading
                  ? "bg-primary-700 opacity-60 cursor-not-allowed pointer-events-none"
                  : "bg-primary-700 cursor-pointer hover:shadow-lg hover:bg-primary-800 active:bg-primary-900"
              }
            `}
            disabled={loading}
          >
            {loading && (
              <img src={loadingSpinner} className="animate-spin h-5" alt="" />
            )}
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
