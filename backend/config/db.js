//database connection garne parts matra yesma
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "studentmgmt"
});

db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("MySQL Connected");
    }
});

 module.exports =db;