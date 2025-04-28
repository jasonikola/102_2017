const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");

const router = express.Router();

router.put('/add', async (req, res) => {
  console.log('/groups/add call');
  const name = req.body.name;

  if (!name) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  try {
    const db = await connectToDatabase();
    const groups = db.collection('groups');
    const group = await groups.findOne({ name: name });

    if (group) {
      res.status(401).json("Vec postoji grupa sa datim imenom");
    } else {
      const members = [];
      await groups.insertOne({ name, members });
      res.status(200).send({ name, members: [] });
    }
  } catch (e) {
    res.status(500);
  }
});

router.get('/get', async (req, res) => {
  console.log('/groups/get call');
  try {
    const db = await connectToDatabase();
    const groupsCollection = await db.collection('groups');
    const groupsCursor = groupsCollection.find();
    const groups = await groupsCursor.toArray();
    // TODO check if manny

    const studentsCollection = await db.collection('students');
    const returnValue = await Promise.all(
      groups.map(async (group) => {
        const students = await studentsCollection.find({ group: group.name }).toArray();
        const members = students.map((student) => {
          return `${student.index} ${student.firstName} ${student.lastName}`;
        });

        return {
          name: group.name,
          members: members,
        };
      })
    );
    res.status(200).json(returnValue);
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
