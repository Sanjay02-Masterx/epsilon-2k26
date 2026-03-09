import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./components/background/fireflies.css";

// NOTE: StrictMode intentionally removed.
// React.StrictMode double-invokes effects in development, which breaks
// the LoadingScreen phase sequencer (timers fire twice, onComplete called early).
ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);