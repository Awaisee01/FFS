import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Mark critical rendering start
if ('performance' in window && 'mark' in performance) {
  performance.mark('react-start');
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);