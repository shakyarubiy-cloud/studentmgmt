import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCard.css";

const API = "http://localhost:3000";

const StudentCard = ({ student, onDelete }) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin";
  const [imgFailed, setImgFailed] = useState(false);

  const details = [
    { label: "Age", value: student.age },
    { label: "Class", value: student.studentClass },
    { label: "Address", value: student.address },
    { label: "Contact", value: student.contact },
  ];

  const showImage = student.image && !imgFailed;

  return (
    <article className="scard">
      <div className="scard-photo">
        {showImage ? (
          <img
            src={`${API}/images/${student.image}`}
            alt={student.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="scard-initial">{(student.name || "?").charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="scard-body">
        <h3>{student.name}</h3>

        <dl>
          {details.map(
            (d) =>
              d.value !== undefined &&
              d.value !== null &&
              d.value !== "" && (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              )
          )}
        </dl>

        {isAdmin && (
          <div className="scard-actions">
            <button className="scard-btn" onClick={() => navigate(`/edit/${student.id}`)}>
              Edit
            </button>
            <button className="scard-btn danger" onClick={() => onDelete(student.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default StudentCard;