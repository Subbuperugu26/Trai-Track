import { NavLink, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import About from "./pages/About";

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="brand" onClick={close}>
          <span className="brand-mark">✦</span>
          <span>Employee Tracker</span>
        </NavLink>

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <span></span><span></span><span></span>
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/tracker" onClick={close}>Employee Tracker</NavLink>
          <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>
          <NavLink to="/reports" onClick={close}>Reports</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}