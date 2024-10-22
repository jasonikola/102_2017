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

module.exports = router;