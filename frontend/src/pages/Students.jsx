import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentCard from "../components/StudentCard";
import Header from "../components/Header";
import "./Student.css";

const API = "http://localhost:3000";
// Works whether your backend returns `id` or MongoDB's `_id`
const getId = (s) => s._id ?? s.id;

const Students = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = () => {
    setLoading(true);
    setError("");
    fetch(`${API}/students`, { headers: { Authorization: token } })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          navigate("/login");
          throw new Error("Session expired. Please log in again.");
        }
        if (!res.ok) throw new Error("Could not load students.");
        return res.json();
      })
      .then((data) => {
        console.log("students response:", data);
        // Accept a plain array, or an object like { students: [...] } / { data: [...] }
        const list = Array.isArray(data) ? data : data?.students ?? data?.data ?? [];
        if (!Array.isArray(list)) throw new Error("Unexpected response from the server (see console).");
        setStudents(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;

    fetch(`${API}/student/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed.");
        return res.json();
      })
      .then(() => setStudents((prev) => prev.filter((s) => getId(s) !== id)))
      .catch((err) => setError(err.message));
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = students.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
    );
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return sort === "za" ? list.reverse() : list;
  }, [students, search, sort]);

  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">
        <div className="students-page">
          <main className="stu-main">
            <section className="stu-head">
              <div>
                <h1>Students</h1>
                <p>
                  {loading
                    ? "Loading students..."
                    : `${students.length} student${students.length === 1 ? "" : "s"} in total`}
                </p>
              </div>
              {isAdmin && (
                <Link to="/studentForm" className="add-btn">
                  + Add student
                </Link>
              )}
            </section>

            <section className="toolbar">
              <div className="search-box">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  placeholder="Search by name or email"
                  aria-label="Search students"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="sort-select"
                aria-label="Sort students"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="az">Name A → Z</option>
                <option value="za">Name Z → A</option>
              </select>
            </section>

            {error && (
              <div className="alert" role="alert">
                <span>{error}</span>
                <button onClick={loadStudents}>Try again</button>
              </div>
            )}

            {!loading && !error && search && (
              <p className="result-count">
                {visible.length} result{visible.length === 1 ? "" : "s"} for “{search}”
              </p>
            )}

            <section className="stu-grid">
              {loading &&
                [1, 2, 3, 4, 5, 6].map((n) => <div key={n} className="stu-skeleton" />)}

              {!loading &&
                visible.map((student) => (
                  <StudentCard
                    key={getId(student)}
                    student={student}
                    onDelete={handleDelete}
                  />
                ))}
            </section>

            {!loading && !error && visible.length === 0 && (
              <div className="stu-empty">
                <span aria-hidden="true">🎓</span>
                <h3>{search ? "No students match your search" : "No students yet"}</h3>
                <p>
                  {search
                    ? "Try a different name or clear the search box."
                    : isAdmin
                    ? "Add your first student to get started."
                    : "Students will appear here once they are added."}
                </p>
                {search ? (
                  <button onClick={() => setSearch("")}>Clear search</button>
                ) : (
                  isAdmin && <Link to="/studentForm" className="add-btn">+ Add student</Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Students;