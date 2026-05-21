import registerBg from "../assets/images/login_bg1.jpg";
import googleIcon from "../assets/icons/google_icon.svg";
import appleIcon from "../assets/icons/apple_icon.svg";
import loginIllustration from "../assets/images/login_illustration.svg";
import { AppleIcon, GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, Navigate } from "react-router-dom";

const Registeration = () => {
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Field cannot be blank.";
    } else if (values.name.length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }

    if (!values.email) {
      errors.email = "Field cannot be blank.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Field cannot be blank.";
    } else if (values.password.length < 8 || values.password.length > 14) {
      errors.password = "Password must contain 8 to 14 characters";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      localStorage.setItem("registeredData", JSON.stringify(values));

      console.log("Registration Successful");
      navigate("/");
      resetForm();
    },
  });

  return (
    <main
      className="h-screen w-full flex justify-between items-center bg-center bg-cover contain-content p-4"
      style={{
        backgroundImage: `url(${registerBg})`,
      }}
    >
      {/* Login content */}
      <div className="h-full text-white m-4 flex flex-col justify-between">
        <div><h1 className="text-2xl font-bold">CRM System</h1></div>
        <img src={loginIllustration} className="h-95" alt="" />
        <div className="mb-15">
          <h1 className="text-4xl mb-1">
            The simplest way to manage your workspaces
          </h1>
          <p>Enter your credential to access your account.</p>
        </div>
      </div>

      {/* Register */}
      <div className="w-1/3 h-full flex flex-col justify-between items-center px-6 py-6 bg-white rounded-lg">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md flex flex-col gap-3"
        >
          {/* Header */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please enter your details to get started.
            </p>
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              autoComplete="off"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-11 px-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-900"
            />
            {formik.touched.name && formik.errors.name && (
              <span className="text-red-600 text-xs mt-1">
                {formik.errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="myname@example.com"
              autoComplete="off"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-11 px-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-900"
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-600 text-xs mt-1">
                {formik.errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-11 px-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-900"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-600 text-xs mt-1">
                {formik.errors.password}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="h-11 mt-2 bg-primary-700 cursor-pointer text-white font-medium rounded-lg hover:shadow-lg hover:bg-primary-800 active:bg-primary-900 transition"
          >
            Register
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4 text-sm text-gray-300">
            <div className="flex-1 border"></div>
            <p className="text-gray-400">Or Continue With</p>
            <div className="flex-1 border"></div>
          </div>

          {/* Social */}
          <div className="flex gap-2">
            <button
              type="button"
              className="w-full h-11 flex items-center justify-center gap-2 border border-gray-300 text-[14px] font-medium rounded-lg bg-gray-50 cursor-pointer hover:shadow-lg hover:bg-gray-100 active:bg-gray-50 transition"
            >
              <img src={googleIcon} alt="goole icon" />
              Google
            </button>
            <button
              type="button"
              className="w-full h-11 flex items-center justify-center gap-2 border border-gray-300 text-[14px] font-medium rounded-lg bg-gray-50 cursor-pointer hover:shadow-lg hover:bg-gray-100 active:bg-gray-50 transition"
            >
              <img src={appleIcon} alt="apple icon" />
              Apple
            </button>
          </div>
        </form>
        {/* Login Redirect */}
        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <a href="/" className="text-primary-700 font-medium">
            Login
          </a>
        </p>
      </div>
    </main>
  );
};

export default Registeration;
