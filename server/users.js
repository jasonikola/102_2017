const express = require('express');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require("./DatabaseConnection");


const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    const badCredentials = "Email ili lozinka nisu tačni.";

    if (user && user.role === 'professor') {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.status(200).send({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          index: user.index,
          components: user.components
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
    const studentsCursor = usersCollection.find({ role: 'student' });
    const students = await studentsCursor.toArray();
    // TODO check what would happen if there is a lot of students

    const returnValue = students.map((student) => {
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
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

router.post('/return', (req, res) => {
  console.log('/users/return call');

  const { components } = req.body;
  if (!components || !Array.isArray(components)) {
    return res.status(400).json({ error: 'Došlo je do greške.' });
  }

  res.status(200).send({ components: components });
});

module.exports = router;