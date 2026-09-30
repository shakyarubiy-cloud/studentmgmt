import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const isAdmin = role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setOpen(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) => (isActive ? "side-link active" : "side-link");
  const close = () => setOpen(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <NavLink to="/home" className="brand" onClick={close}>
          E-Mgmt
        </NavLink>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="side-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <div id="side-nav" className={open ? "sidebar-body open" : "sidebar-body"}>
        <nav aria-label="Main">
          <ul>
            <li>
              <NavLink to="/home" className={linkClass} onClick={close}>
                <span aria-hidden="true">🏠</span> Home
              </NavLink>
            </li>

            {token && (
              <li>
                <NavLink to="/student" className={linkClass} onClick={close}>
                  <span aria-hidden="true">🎓</span> Students
                </NavLink>
              </li>
            )}

            {token && isAdmin && (
              <li>
                <NavLink to="/studentForm" className={linkClass} onClick={close}>
                  <span aria-hidden="true">➕</span> Add Student
                </NavLink>
              </li>
            )}

            {!token && (
              <>
                <li>
                  <NavLink to="/login" className={linkClass} onClick={close}>
                    <span aria-hidden="true">🔑</span> Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={linkClass} onClick={close}>
                    <span aria-hidden="true">📝</span> Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {token && (
          <div className="sidebar-user">
            <div className="user-info">
              <span className="avatar">{(name || role || "U").charAt(0).toUpperCase()}</span>
              <div>
                <strong>{name || "User"}</strong>
                {role && <small>{role}</small>}
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Header;