import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Garder uniquement ici
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "./assets/style/main.scss";
import "../node_modules/font-awesome/css/font-awesome.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Un seul BrowserRouter ici */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Si vous voulez mesurer les performances, activez ce log :
reportWebVitals();
