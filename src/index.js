import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

const localTheme = localStorage.getItem("theme");
document.documentElement.setAttribute("data-theme", localTheme);

root.render(<App />);
