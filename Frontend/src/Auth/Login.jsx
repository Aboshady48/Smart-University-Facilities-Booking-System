import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API;

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(`${API}/auth/student/login`, data);

      toast.success("Login successful 🎉");

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-colors duration-300"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Sign In
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
        />

        {/* remember me */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            className="mr-2"
          />
          <label htmlFor="remember" className="text-gray-600 dark:text-gray-400">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>


        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Forgot Password
          </a>
        </p>

        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};