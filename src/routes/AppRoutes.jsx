import { Routes, Route } from "react-router-dom";

import Home         from "../pages/Home";
import About        from "../pages/About";
import Events       from "../pages/Events";
import EventDetails from "../pages/EventDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                element={<Home />} />
      <Route path="/home"            element={<Home />} />
      <Route path="/about"           element={<About />} />
      <Route path="/events"          element={<Events />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
    </Routes>
  );
}
