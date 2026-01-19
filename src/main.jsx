import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App.jsx";
import "./index.css";
// import "./Styles/app.scss";
import { HelmetProvider } from "react-helmet-async";

axios.defaults.withCredentials = true;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
        <App />
    </HelmetProvider>
  </StrictMode>
);
