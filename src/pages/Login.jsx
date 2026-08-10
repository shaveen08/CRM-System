import loginBg from "../assets/images/login_bg1.jpg";
import loadingSpinner from "../assets/icons/spinner.svg";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Small inline icons — no external icon-name dependency, zero risk of a
// missing export breaking the build.
const MailIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...props}
  >
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...props}
  >
    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
  </svg>
);

const EyeIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...props}
  >
    <path
      d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...props}
  >
    <path d="M3 3l18 18" strokeLinecap="round" />
    <path
      d="M10.6 5.6A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a13.9 13.9 0 0 1-3.4 4.1M6.6 6.6C4 8.3 2.5 12 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.6-.8M9.9 9.9a3 3 0 0 0 4.2 4.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AlertIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    {...props}
  >
    <path d="M12 9v4.5" strokeLinecap="round" />
    <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
    <path
      d="M10.6 3.9 2.9 17.5A1.8 1.8 0 0 0 4.5 20.2h15a1.8 1.8 0 0 0 1.6-2.7L13.4 3.9a1.8 1.8 0 0 0-2.8 0Z"
      strokeLinejoin="round"
    />
  </svg>
);

// Quiet "connected records" motif for the desktop panel — a CRM is a
// network of linked entries, rendered as a restrained dot/line pattern
// rather than literal illustration.
const NetworkMotif = () => (
  <svg
    viewBox="0 0 420 420"
    className="absolute -right-16 -bottom-16 h-[28rem] w-[28rem] opacity-[0.14]"
    fill="none"
  >
    <g stroke="white" strokeWidth="1">
      <line x1="60" y1="80" x2="180" y2="150" />
      <line x1="180" y1="150" x2="320" y2="90" />
      <line x1="180" y1="150" x2="150" y2="290" />
      <line x1="150" y1="290" x2="300" y2="330" />
      <line x1="150" y1="290" x2="40" y2="340" />
      <line x1="320" y1="90" x2="360" y2="220" />
      <line x1="300" y1="330" x2="360" y2="220" />
    </g>
    <g fill="white">
      <circle cx="60" cy="80" r="5" />
      <circle cx="180" cy="150" r="7" />
      <circle cx="320" cy="90" r="5" />
      <circle cx="150" cy="290" r="6" />
      <circle cx="300" cy="330" r="5" />
      <circle cx="40" cy="340" r="4" />
      <circle cx="360" cy="220" r="5" />
    </g>
  </svg>
);

const Login = () => {
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left — brand / photo panel. Hidden below lg: there isn't room for
          a decorative panel on a phone, and the form is the job there. */}
      <div
        className="relative hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between overflow-hidden bg-center bg-cover p-10 xl:p-14"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        {/* Contrast overlay — legible text over any photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-900/55 to-primary-950/85" />
        <NetworkMotif />

        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="h-8 w-8 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center font-bold">
            C
          </div>
          <span className="text-lg font-semibold tracking-tight">
            CRM System
          </span>
        </div>

        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight">
            Every lead, every deal, in one place.
          </h1>
          <p className="mt-3 text-white/70 text-[15px] leading-relaxed">
            Sign in to pick up right where your team left off.
          </p>
        </div>
      </div>

      {/* Right — auth panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-14">
        {/* Mobile-only brand mark, since the left panel is hidden */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary-700 text-white flex items-center justify-center font-bold">
            C
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            CRM System
          </span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mt-1.5">
              Enter your details to access your account.
            </p>
          </div>

          {error.auth && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error.auth}</span>
            </div>
          )}

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="myname@example.com"
                  value={formik.values.email}
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className={`w-full h-11 pl-10 pr-3 border rounded-lg bg-gray-50 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-600 text-xs mt-1.5">
                  {formik.errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Myname@123"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  className={`w-full h-11 pl-10 pr-10 border rounded-lg bg-gray-50 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-[18px] w-[18px]" />
                  ) : (
                    <EyeIcon className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-600 text-xs mt-1.5">
                  {formik.errors.password}
                </span>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`h-11 mt-2 gap-2 text-white text-[15px] font-medium rounded-lg transition flex items-center justify-center
                ${
                  loading
                    ? "bg-primary-700 opacity-60 cursor-not-allowed pointer-events-none"
                    : "bg-primary-700 cursor-pointer hover:bg-primary-800 active:bg-primary-900"
                }
              `}
            >
              {loading && (
                <img src={loadingSpinner} className="animate-spin h-5" alt="" />
              )}
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
