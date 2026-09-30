const express = require("express")
const router = express.Router();
const {
    addStudent,
    viewStudent,
    getOneStudent,
    deleteStudent,
    updateStudent,
    dashboard
}= require ('../controllers/studentController');
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

router.post("/student", upload.single("image"), verifyToken, isAdmin, addStudent);
router.get("/students", verifyToken, viewStudent);
router.delete("/student/:id", verifyToken, isAdmin, deleteStudent);
router.get("/student/:id", verifyToken, isAdmin, getOneStudent);
router.put("/student/:id", upload.single("image"), verifyToken, isAdmin, updateStudent);
router.get("/dashboard",dashboard);

module.exports= router;