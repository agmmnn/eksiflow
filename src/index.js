import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Flow from "./Flow";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <Flow />
  </React.StrictMode>
);
