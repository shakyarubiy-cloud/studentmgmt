const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

app.use("/", studentRoutes);
app.use("/", authRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});