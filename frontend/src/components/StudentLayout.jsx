import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import headerLogo from "../images/header-logo.png";
import "./../StudentLayout.css";

function StudentLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/students/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log("Logout Error:", err);
    } finally {
      localStorage.removeItem("student");

      navigate("/", {
        replace: true,
      });
    }
  };

  // Mobile menu click
  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mobile sidebar থেকে page select করলে sidebar close হবে
  const handleNavigate = (path) => {
    navigate(path);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="student-layout">

      {/* ================= HEADER ================= */}

      <header className="student-header">

        {/* MENU BUTTON */}

        <div className="university-header">
          <button
            className="header-menu-button"
            onClick={handleMenuClick}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>


        {/* LOGO */}

        <div className="university-title-wrapper">
          <div className="university-logo">
            <img src={headerLogo} alt="University Logo" />
          </div>
        </div>


        {/* LOGOUT */}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      {/* ================= BODY ================= */}

      <div className="student-body">

        {/* ================= MOBILE OVERLAY ================= */}

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}


        {/* ================= SIDEBAR ================= */}

        <aside
          className={`sidebar-content-text ${
            sidebarOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >

          <div
            className="sidebar-item"
            onClick={() => handleNavigate("/personal-info")}
          >
            <span className="menu-icon">
              ☰
            </span>

            <span>Personal Info</span>
          </div>


          <div
            className="sidebar-item"
            onClick={() => handleNavigate("/semester-result")}
          >
            <span className="menu-icon">
              ☰
            </span>

            <span>Result</span>
          </div>


          <div
            className="sidebar-item"
            onClick={() => handleNavigate("/overall-result")}
          >
            <span className="menu-icon">
              ☰
            </span>

            <span>Overall Result</span>
          </div>

        </aside>


        {/* ================= PAGE CONTENT ================= */}

        <main className="student-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default StudentLayout;