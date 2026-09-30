import React, { useState, useEffect } from "react";
import "./StudentForm.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

const API = "http://localhost:3000";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isEdit = Boolean(id);

  const [image, setImage] = useState(""); // File (new upload) or filename string (existing)
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load the student when editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/student/${id}`, { headers: { Authorization: token } })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load this student.");
        return res.json();
      })
      .then((data) => {
        setImage(data.image || "");
        setName(data.name || "");
        setAge(data.age ?? "");
        setStudentClass(data.studentClass ?? "");
        setAddress(data.address || "");
        setContact(data.contact ?? "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  // Image preview: new file -> local preview, existing filename -> server image
  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(image ? `${API}/images/${image}` : "");
  }, [image]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter the student's name.");
    if (!age || !studentClass || !contact || !address.trim())
      return setError("Please fill in age, class, contact and address.");

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("name", name.trim());
    formData.append("age", age);
    formData.append("studentClass", studentClass);
    formData.append("address", address.trim());
    formData.append("contact", contact);

    setSaving(true);
    fetch(isEdit ? `${API}/student/${id}` : `${API}/student`, {
      method: isEdit ? "PUT" : "POST",
      body: formData,
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not save the student. Please try again.");
        return res.json();
      })
      .then(() => navigate("/student"))
      .catch((err) => {
        setError(err.message);
        setSaving(false);
      });
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">
        <div className="sform-page">
          <main className="sform-main">
            <Link to="/student" className="back-link">← Back to students</Link>

            <div className="sform-card">
              <h1>{isEdit ? "Update student" : "Register student"}</h1>
              <p className="sform-sub">
                {isEdit ? "Change the details below and save." : "Fill in the details to add a new student."}
              </p>

              {error && (
                <div className="alert" role="alert">{error}</div>
              )}

              <form className="sform" onSubmit={handleSubmit}>
                <div className="photo-row">
                  <div className="photo-preview">
                    {preview ? (
                      <img src={preview} alt="Student preview" onError={() => setPreview("")} />
                    ) : (
                      <span aria-hidden="true">📷</span>
                    )}
                  </div>
                  <div>
                    <label className="upload-btn">
                      {preview ? "Change photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && setImage(e.target.files[0])}
                      />
                    </label>
                    <p className="hint">
                      {image instanceof File ? image.name : "JPG or PNG. A clear face photo works best."}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label htmlFor="name">Student name</label>
                    <input id="name" type="text" placeholder="e.g. Sana Shrestha" value={name}
                      onChange={(e) => setName(e.target.value)} disabled={loading} />
                  </div>
                  <div className="field">
                    <label htmlFor="age">Age</label>
                    <input id="age" type="number" min="1" placeholder="e.g. 15" value={age}
                      onChange={(e) => setAge(e.target.value)} disabled={loading} />
                  </div>
                </div>

                <div className="row">
                  <div className="field">
                    <label htmlFor="class">Class</label>
                    <input id="class" type="number" min="1" placeholder="e.g. 9" value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)} disabled={loading} />
                  </div>
                  <div className="field">
                    <label htmlFor="contact">Contact</label>
                    <input id="contact" type="number" placeholder="e.g. 9800000000" value={contact}
                      onChange={(e) => setContact(e.target.value)} disabled={loading} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="address">Address</label>
                  <textarea id="address" rows="3" placeholder="e.g. Sundhara, Kathmandu" value={address}
                    onChange={(e) => setAddress(e.target.value)} disabled={loading} />
                </div>

                <div className="form-actions">
                  <Link to="/student" className="cancel-btn">Cancel</Link>
                  <button type="submit" className="save-btn" disabled={saving || loading}>
                    {saving ? "Saving..." : isEdit ? "Update student" : "Add student"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;