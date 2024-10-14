const express = require('express');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require("./DatabaseConnection");


const router = express.Router();

router.post('/login', async (req, res) => {
  console.log('/login call')
  try {
    const { email, password } = req.body;
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    const badCredentials = "Email ili lozinka nisu tačni.";

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const schoolYearDataCollection = db.collection('schoolYearData');
        const currentYear = await schoolYearDataCollection.findOne({ current: true });
        const years = (await schoolYearDataCollection.find({}).toArray()).map((year) => year.year);

        res.status(200).send({
          email: user.email,
          schoolYearData: {
            year: currentYear.year,
            courses: currentYear.courses
          },
          schoolYears: years
        });
      } else {
        res.status(400).send({ error: badCredentials });
      }
    } else {
      res.status(400).send({ error: badCredentials });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    console.log('/users/students call');
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const studentsCursor = usersCollection.find();
    const students = await studentsCursor.toArray();
    // TODO check what would happen if there is a lot of students

    const returnValue = students.map((student) => {
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        role: student.role,
        index: student.index,
        components: student.components
      };
    });
    res.status(200).send(returnValue);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.put('/addStudent', async (req, res) => {
  const { index, firstName, lastName, courses } = req.body;

  if (!index || !firstName || !lastName || !courses || !courses.length) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  try {
    const db = await connectToDatabase();
    const studentsCollection = db.collection('users'); // students
    const student = await studentsCollection.findOne({ index });

    if (student) {
      console.log(student)
    } else {
      console.log("Nema studenta")
      const result = await studentsCollection.insertOne({ index, firstName, lastName, courses });
      console.log(result)
      res.status(200).json("Student uspesno dodat");
    }
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;