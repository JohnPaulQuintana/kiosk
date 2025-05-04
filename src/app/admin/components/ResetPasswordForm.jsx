import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Extract token from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    setToken(tokenFromUrl);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!password || !confirmPassword) {
      Swal.fire("Error", "Please fill in all fields.", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match.", "error");
      return;
    }

    setLoading(true);

    try {
      // Send a request to reset the password
      const response = await fetch(`${apiUrl}/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Notify the user and redirect to login page
        Swal.fire("Success", data.message, "success").then(() => {
          navigate("/login"); // Redirect to login page after successful reset
        });
      } else {
        // Handle error response from the backend
        Swal.fire("Error", data.message || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center h-screen">
      <div className="border p-10 bg-white shadow rounded-sm w-full sm:w-[70%] lg:w-[30%]">
        <div className="flex flex-col items-center mb-4">
          <img src="/resources/logo/logo.png" alt="Logo" className="w-20" />
          <span className="font-bold text-4xl uppercase text-red-700">
            Campus
          </span>
          <span className="text-2xl font-semibold text-slate-700">
            Navigational Kiosk
          </span>
        </div>
        <span className="text-xl font-semibold text-slate-700 mb-8">
          Reset Your Password
        </span>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="password"
              className="text-base font-semibold text-slate-700"
            >
              New Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2"
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="confirmPassword"
              className="text-base font-semibold text-slate-700"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full items-center justify-center">
            <div className="bg-red-500 text-white rounded-sm hover:bg-red-700">
              <Link
                to={"/login"}
                className="border w-full p-2 text-center block"
              >
                Back to Login
              </Link>
            </div>
            <div className="bg-red-500 text-white rounded-sm hover:bg-red-700">
              <button
                type="submit"
                className="border w-full p-2 text-center"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
