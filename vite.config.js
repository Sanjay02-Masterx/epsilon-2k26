import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      // Add your ngrok domain here
      "68563810f393.ngrok-free.app",

      // Or allow all ngrok subdomains (safer if the domain changes each run)
      ".ngrok-free.app"
    ]
  }
});