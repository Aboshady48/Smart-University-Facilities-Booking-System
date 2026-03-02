import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ThemeProvider } from "./context/ThemeContext";   // ← Make sure path is correct
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>           {/* ← THIS LINE WAS MISSING */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);