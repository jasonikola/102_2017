const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");

const router = express.Router();

router.put('/add', async (req, res) => {
  const { index, firstName, lastName, courses } = req.body;

  if (!index || !firstName || !lastName || !courses || !courses.length) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }
// TODO add years to every students, add year on request and in if statement
  try {
    const db = await connectToDatabase();
    const studentsCollection = db.collection('students');
    const student = await studentsCollection.findOne({ index });

    if (student) {
      if (!student.firstName === firstName || !student.lastName === lastName) {
        res.status(401).json("Korisnik sa datim imenom vec postoji")
      }

      const updatedCourses = [...new Set([...student.courses, ...courses])];
      await studentsCollection.updateOne({ index }, { $set: { courses: updatedCourses } });
      res.status(200).json("Uspesno dodat predmet studentu");
    } else {
      await studentsCollection.insertOne({ index, firstName, lastName, courses });
      res.status(200).json("Student uspеno dodat");
    }
  } catch (e) {
    res.status(500);
  }
});

router.get('/get', async (req, res) => {
  try {
    console.log('/students/get call');
    const db = await connectToDatabase();
    const usersCollection = db.collection('students');
    const studentsCursor = usersCollection.find();
    const students = await studentsCursor.toArray();
    // TODO check what would happen if there is a lot of students

    const returnValue = students.map((student) => {
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        index: student.index,
        courses: student.courses
      };
    });
    res.status(200).send(returnValue);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;