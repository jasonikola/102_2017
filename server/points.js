const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('/points get call');

  try {
    const db = await connectToDatabase();
    const studentsCollection = db.collection('students');
    const studentsCursor = await studentsCollection.find();
    const students = await studentsCursor.toArray();

    const returnData = students.map(({ _id, group, points, ...rest }) => ({
      ...rest,
      ...points
    }));
    res.status(200).json(returnData);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
