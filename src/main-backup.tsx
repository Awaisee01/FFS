console.log('🚀 MAIN DEBUG: Main.tsx file loading started - immediate execution');
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Load styles first
console.log('🚀 MAIN DEBUG: All imports loaded successfully');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('💥 CRITICAL: Root element not found!');
  document.body.innerHTML = '<div style="padding: 40px; text-align: center; font-family: Arial;"><h1>Error: App container not found</h1><p>The root element is missing from the HTML.</p></div>';
  throw new Error("Root element not found");
}
console.log('✅ MAIN DEBUG: Root element found:', rootElement);

const root = createRoot(rootElement);

// Mark critical rendering start
if ('performance' in window && 'mark' in performance) {
  performance.mark('react-start');
}

console.log('🚀 Main.tsx: Starting React app render');
console.log('🚀 MAIN DEBUG: About to render with App component:', App);

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ Main.tsx: React app render completed successfully');
} catch (error) {
  console.error('💥 CRITICAL: React render failed:', error);
  rootElement.innerHTML = `
    <div style="padding: 40px; font-family: Arial; background: #fee; border: 2px solid #f00; margin: 20px;">
      <h1 style="color: #c00;">React App Failed to Render</h1>
      <p><strong>Error:</strong> ${error instanceof Error ? error.message : String(error)}</p>
      <p>Check the console for more details.</p>
    </div>
  `;
}