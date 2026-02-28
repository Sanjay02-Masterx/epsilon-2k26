import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

/**
 * Wrapper to sync Navbar state with React Router
 */
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("home");

  // Sync URL -> Navbar active state
  useEffect(() => {
    const path = location.pathname.split("/")[1];

    if (!path) {
      setCurrentPage("home");
    } else {
      setCurrentPage(path);
    }
  }, [location.pathname]);

  // Navbar click -> Router navigation
  const handleNavigate = (page) => {
    setCurrentPage(page);
    navigate(page === "home" ? "/" : `/${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
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