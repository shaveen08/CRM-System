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

const Login = () => {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    } else if (values.password.length < 8 || values.password.length > 14) {
      errors.password = "Password must contain 8 to 14 characters";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      try {
        setLoading(true);
        const data = localStorage.getItem("registeredData");
        const registeredUser = data ? JSON.parse(data) : null;

        if (!registeredUser) {
          setError({ auth: "No user found. Please register first." });
          return;
        }

        if (
          values.email !== registeredUser.email ||
          values.password !== registeredUser.password
        ) {
          setError({ auth: "Invalid Email or Password" });
          return;
        }

        // Success
        localStorage.setItem("loggedUser", JSON.stringify(values));
        setError({});
        resetForm();
        navigate("/dashboard")

        console.log("Login Successful");
      } catch (err) {
        setError({ auth: "Something went wrong. Try again." });
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

          <div className=" flex justify-between ">
            {/* Remember me */}
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer text-[14px]">
              <input type="checkbox" name="rememberMe" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            {/* Forget password */}
            <div className="text-gray-500 cursor-pointer text-[14px]">
              <Link to="">Forget Password?</Link>
            </div>
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

        {/* Register */}
        <p className="text-center text-sm mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-700 font-medium">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
