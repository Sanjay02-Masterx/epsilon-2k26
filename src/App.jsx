import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import AppRoutes     from "./routes/AppRoutes";
import Navbar        from "./components/common/Navbar";
import Footer        from "./components/common/Footer";
import LoadingScreen from "./components/common/LoadingScreen";

// ─────────────────────────────────────────────────────────────────────────────
//  Boot sequence
//
//  FIRST EVER VISIT  →  index.html script redirects to /epsilon-intro.html
//                         (happens before React even boots, zero flash)
//                         User watches intro, clicks "Enter the Upside Down ⚡"
//                         → epsilon-intro.html sets sessionStorage.introSeen = '1'
//                         → navigates to /home
//                         → App mounts → LoadingScreen (~2.85s) → full app
//
//  EVERY REFRESH     →  index.html skips redirect (introSeen already set)
//                         → App mounts → LoadingScreen (~2.85s) → full app
//
//  REACT ROUTER NAV  →  No hard reload → LoadingScreen does not re-show
// ─────────────────────────────────────────────────────────────────────────────

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Derive currentPage from the URL directly
  const path = location.pathname.split("/")[1];
  const currentPage = path || "home";

  // Show LoadingScreen on every hard load/refresh (no sessionStorage skip)
  const [loading, setLoading] = useState(true);
  const handleLoadingComplete = () => setLoading(false);

  // Navbar click → Router navigation
  const handleNavigate = (page) => {
    navigate(page === "home" ? "/" : `/${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
