-- ============================================
-- STUDENT MANAGEMENT SYSTEM DATABASE
-- Database: studentmgmt
-- ============================================

CREATE DATABASE IF NOT EXISTS studentmgmt;

USE studentmgmt;


-- ============================================
-- USERS TABLE
-- Used for login, registration and roles
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
);


-- ============================================
-- STUDENTS TABLE
-- Used for student CRUD operations
-- ============================================

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    age INT,
    studentClass VARCHAR(50),
    address VARCHAR(255),
    contact VARCHAR(30)
);


-- ============================================
-- END
-- ============================================