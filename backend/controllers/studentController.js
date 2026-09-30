const db= require('../config/db');


const addStudent =  (req, res) => {
  const {
    name,
    age,
    studentClass,
    address,
    contact,
  } = req.body;
  const image = req.file.filename;

  const sql = `
INSERT INTO students
(image, name, age, studentClass, address, contact)
VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(
  sql,
  [image, name, age, studentClass, address, contact],
  (err, result) => {
    if (err) {
      console.log(err);
      res.json({
        message: "Error",
      });
    } else {
      res.json({
        message: "Student Added!",
      });
    }
  }
);
};

const viewStudent = (req, res) => {
    const sql= "select * from Students";
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                message:"Error",
            });

        }
        else{
            res.json(result);
        }
    });

};

const deleteStudent =  (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
};

const getOneStudent = (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result[0]);
    }
  });
};

const updateStudent = (req, res) => {
  const id = req.params.id;

  const { name, age, studentClass, address, contact } = req.body;

  const image = req.file ? req.file.filename : null;

  const sql = `
    UPDATE students
    SET
    //old value deu is new is null
       image = COALESCE(?, image), 
      name = ?,
      age = ?,
      studentClass = ?,
      address = ?,
      contact = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [image, name, age, studentClass, address, contact, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          message: "Error",
        });
      } else {
        res.json({
          message: "Student Updated!",
        });
      }
    }
  );
};


const dashboard = (req, res) => {
  const sql = "SELECT COUNT(*) AS totalStudents FROM students";
  const sql2 = "SELECT COUNT(*) AS totalAdmins FROM users WHERE role = 'admin'";

  db.query(sql, (err, studentResult) => {
    if (err) {
      return res.json(err);
    }

    db.query(sql2, (err, adminResult) => {
      if (err) {
        return res.json(err);
      }

      res.json({
        totalStudents: studentResult[0].totalStudents,
        totalAdmins: adminResult[0].totalAdmins,
      });
    });
  });
};


module.exports= {
    addStudent,
    viewStudent,
    getOneStudent,
    deleteStudent,
    updateStudent,
    dashboard
};