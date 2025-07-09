import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaBars } from "react-icons/fa";
import './layout.css';

const UserLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Better regex: allow MongoDB ObjectIDs
  const isQuizAttemptPage = /^\/user\/quizzes\/attempt\/[a-zA-Z0-9]+$/.test(location.pathname);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/";
  };

  return (
    <div className="user-layout">
      {!isQuizAttemptPage && (
        <nav className="user-navbar">
          <div className="nav-container">
            <NavLink to="/user" className="logo">
              StudySync
            </NavLink>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <FaBars className="menu-icon" />
            </button>
            <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
              <NavLink
                to="/user/dashboard"
                className={({ isActive }) => (isActive ? "user-active" : undefined)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/user/my-notes"
                className={({ isActive }) => (isActive ? "user-active" : undefined)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Notes
              </NavLink>
              <NavLink
                to="/user/flashcards"
                className={({ isActive }) => (isActive ? "user-active" : undefined)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Flashcards
              </NavLink>
              <NavLink
                to="/user/quizzes"
                className={({ isActive }) => (isActive ? "user-active" : undefined)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Quizzes
              </NavLink>
              <NavLink
                to="/user/progress"
                className={({ isActive }) => (isActive ? "user-active" : undefined)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Progress
              </NavLink>
              <div className="dropdown">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                  <FaUser className="user-icon" />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <NavLink
                      to="/user/profile"
                      className={({ isActive }) => (isActive ? "user-active" : undefined)}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FaUser className="dropdown-icon" /> Profile
                    </NavLink>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FaSignOutAlt className="dropdown-icon" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={`user-content ${isQuizAttemptPage ? 'full-screen' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
