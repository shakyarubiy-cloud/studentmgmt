import React from "react";
import { Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

const MyRoute = () => {
  return (
    <>

      <Routes>
       <Route
  path="/"
  element={
      <Login />
  
  }
/>
<Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
<Route
  path="/student"
  element={
    <ProtectedRoute>
      <Students />
    </ProtectedRoute>
  }
/>
        <Route path="/studentForm" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  );
};

export default MyRoute;