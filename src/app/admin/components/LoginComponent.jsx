import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
const LoginComponent = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const frontUrl = import.meta.env.VITE_FRONTEND_URL;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState([]);
  const navigate = useNavigate(); // For navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess([]);

    if (!formData.email || !formData.password) {
      setError("Email and Password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("authToken", data.token);

        setSuccess(data);
        console.log("Token:", data.token);

        // Redirect to the admin dashboard
        setTimeout(() => {
          navigate("/dashboard/floor");
        }, 3000); // Optional delay for showing success message
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess([]);
      }, 3000);
    }
  };


  const handleResetPassword = () => {
    Swal.fire({
      title: "Enter your email address",
      input: "email",
      inputLabel: "Email address",
      inputPlaceholder: "Enter your email",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Email is required!";
        }
        return null;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const email = result.value;
        const url = `${frontUrl}reset`
        setLoading(true);
        try {
          const response = await fetch(`${apiUrl}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email,url }),
          });

          const data = await response.json();

          if (response.ok) {
            Swal.fire({
              title: "Success!",
              text: "A password reset link has been sent to your email.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: data.message || "Failed to send reset link. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (err) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="w-full flex items-center justify-center h-screen">
      {success?.token && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div className="loader border-t-4 border-green-500 border-solid w-12 h-14 rounded-full animate-spin"></div>
            <p className="ml-4 text-green-700 text-xl">{success.data.name}</p>
            <p className="ml-4 text-slate-700">{success.message}</p>
            <p className="ml-4 text-slate-700">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div className="loader border-t-4 border-red-500 border-solid w-12 h-14 rounded-full animate-spin"></div>
            <p className="ml-4 text-red-700">Authenticating...</p>
          </div>
        </div>
      )}
      <div className="border p-10 bg-white shadow rounded-sm w-full sm:w-[70%] lg:w-[30%]">
        <div className="flex flex-col items-center mb-4">
          <img src="/resources/logo/logo.png" alt="Logo" className="w-20" />
          <span className="font-bold text-4xl uppercase text-red-700">Campus</span>
          <span className="text-2xl font-semibold text-slate-700">
            Navigational Kiosk
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="email"
              className="text-xl font-semibold text-slate-700"
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="password"
              className="text-xl font-semibold text-slate-700"
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2"
            />
          </div>
          <div className="flex items-center justify-end mb-4">
            <a
            onClick={handleResetPassword}
              href="#"
              className="border-b-2 border-gray-300 text-red-700 hover:text-red-900 hover:border-red-700"
            >
              Reset Password
            </a>
          </div>

          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="bg-red-500 text-white rounded-sm hover:bg-red-700">
            <button type="submit" className="border w-full p-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
