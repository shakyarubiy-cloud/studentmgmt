const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//login
const  login= async (req, res) => {
    const { email, password} = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.json(err);
        }

        if (result.length === 0) {
            return res.json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            result[0].password
        );

        if (!isMatch) {
            return res.json({
                message: "Wrong password"
            });
        }

        const token = jwt.sign(
            {
                id: result[0].id,
                email: result[0].email,
                role: result[0].role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token: token,
            role:result[0].role
        });
    });
};

//register
 const register =async (req, res) => {
    const { username, email, password } = req.body;

const role = "student";

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

    // ✍️ Write the db.query() here
    db.query(sql, [username,email,hashedPassword, role], (err,result)=>{
      if(err){
        res.json(err);
      }else{
        res.json("register sucessful");
      }
    })
};

module.exports ={
    login,register
}