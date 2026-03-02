import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Register } from "./Auth/Register";
import { Login } from "./Auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />

        <div className="pt-20 px-4">
          <Routes>
            <Route path="/" element={<h1 className="text-2xl text-gray-800 dark:text-white">Home Page</h1>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};