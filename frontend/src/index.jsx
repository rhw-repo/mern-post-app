import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/global.css";
import App from "./App";
import { MaterialsContextProvider } from "./context/MaterialContext";
import { AuthContextProvider } from "./context/AuthContext";
import 'regenerator-runtime';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <MaterialsContextProvider>
        <App />
      </MaterialsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
