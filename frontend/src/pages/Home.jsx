import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:3000";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* Bar chart: students vs admins (plain SVG, no library needed) */
function BarChart({ students, admins }) {
  const max = Math.max(students, admins, 1);
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const base = 180;
  const h = 170;
  const y = (v) => base - (v / top) * h;
  const bars = [
    { label: "Students", value: students, x: 80, cls: "bar-students" },
    { label: "Admins", value: admins, x: 210, cls: "bar-admins" },
  ];

  return (
    <svg viewBox="0 0 360 215" className="chart" role="img"
      aria-label={`Bar chart: ${students} students and ${admins} admins`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1="40" x2="350" y1={y(step * i)} y2={y(step * i)} className="grid-line" />
          <text x="32" y={y(step * i) + 4} textAnchor="end" className="axis-text">
            {step * i}
          </text>
        </g>
      ))}
      {bars.map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={y(b.value)} width="70" height={base - y(b.value)} rx="4" className={b.cls} />
          <text x={b.x + 35} y={y(b.value) - 6} textAnchor="middle" className="value-text">
            {b.value}
          </text>
          <text x={b.x + 35} y="202" textAnchor="middle" className="axis-text">
            {b.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* Donut chart: share of students vs admins */
function Donut({ students, admins }) {
  const total = students + admins;
  const r = 54;
  const C = 2 * Math.PI * r;
  const s = total ? (students / total) * C : 0;
  const pct = total ? Math.round((students / total) * 100) : 0;

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 140 140" className="donut" role="img"
        aria-label={`${pct}% students, ${100 - pct}% admins`}>
        <circle cx="70" cy="70" r={r} className="donut-track" />
        {total > 0 && (
          <circle cx="70" cy="70" r={r} className="donut-fill"
            strokeDasharray={`${s} ${C - s}`} transform="rotate(-90 70 70)" />
        )}
        <text x="70" y="68" textAnchor="middle" className="donut-total">{total}</text>
        <text x="70" y="86" textAnchor="middle" className="axis-text">users</text>
      </svg>
      <ul className="legend">
        <li><i className="dot dot-students" /> Students <b>{pct}%</b></li>
        <li><i className="dot dot-admins" /> Admins <b>{total ? 100 - pct : 0}%</b></li>
      </ul>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "there";
  const isAdmin = role === "admin";

  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalAdmins: 0,
    recentStudents: [], // optional: [{ _id, name, email }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = () => {
    setLoading(true);
    setError("");
    fetch(`${API}/dashboard`, { headers: { Authorization: token } })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          navigate("/login");
          throw new Error("Session expired. Please log in again.");
        }
        if (!res.ok) throw new Error("Could not load dashboard data.");
        return res.json();
      })
      .then((data) => setDashboard((prev) => ({ ...prev, ...data })))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const students = Number(dashboard.totalStudents) || 0;
  const admins = Number(dashboard.totalAdmins) || 0;
  const totalUsers = students + admins;

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const stats = [
    { label: "Students", value: students, tone: "students", icon: "🎓" },
    { label: "Admins", value: admins, tone: "admins", icon: "🛡️" },
    { label: "Total users", value: totalUsers, tone: "total", icon: "👥" },
    { label: "Students per admin", value: admins ? (students / admins).toFixed(1) : "—", tone: "ratio", icon: "⚖️" },
  ];

  const actions = [
    { to: "/student", title: "View students", text: "Browse and search all students." },
    ...(isAdmin ? [{ to: "/studentForm", title: "Add student", text: "Register a new student." }] : []),
  ];

  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">
        <div className="home">
          <main className="main">
            <section className="hero">
              <div>
                <p className="hero-date">{today}</p>
                <h1>{greeting()}, {name} 👋</h1>
                <p className="hero-sub">
                  {loading
                    ? "Loading your overview..."
                    : `${students} student${students === 1 ? "" : "s"} and ${admins} admin${admins === 1 ? "" : "s"} in the system.`}
                </p>
                <div className="hero-actions">
                  <Link to="/student" className="hero-btn">View students</Link>
                  {isAdmin && <Link to="/studentForm" className="hero-btn ghost">+ Add student</Link>}
                </div>
              </div>
              <span className="hero-role">{role || "guest"}</span>
            </section>

            {error && (
              <div className="alert" role="alert">
                <span>{error}</span>
                <button onClick={loadDashboard}>Try again</button>
              </div>
            )}

            <section className="stats" aria-label="Overview">
              {stats.map((s) => (
                <article key={s.label} className={`stat stat-${s.tone}`}>
                  <span className="stat-icon" aria-hidden="true">{s.icon}</span>
                  <div>
                    <h3>{s.label}</h3>
                    {loading ? <div className="skeleton" /> : <p>{s.value}</p>}
                  </div>
                </article>
              ))}
            </section>

            <div className="grid">
              <section className="panel">
                <h2>Students vs admins</h2>
                {loading ? <div className="skeleton chart-skeleton" /> : <BarChart students={students} admins={admins} />}
              </section>

              <section className="panel">
                <h2>User breakdown</h2>
                {loading ? <div className="skeleton chart-skeleton" /> : <Donut students={students} admins={admins} />}
              </section>
            </div>

            <section className="panel">
              <h2>Recently added students</h2>
              {dashboard.recentStudents?.length ? (
                <ul className="recent">
                  {dashboard.recentStudents.slice(0, 5).map((st) => (
                    <li key={st._id || st.email}>
                      <span className="avatar">{(st.name || "?").charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{st.name}</strong>
                        <small>{st.email}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Newly added students will show up here.</p>
              )}
            </section>

            <section>
              <h2>Quick actions</h2>
              <div className="action">
                {actions.map((a) => (
                  <Link key={a.to} to={a.to} className="action-card">
                    <strong>{a.title}</strong>
                    <span>{a.text}</span>
                  </Link>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;