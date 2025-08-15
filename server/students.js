const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const { parse } = require("csv-parse/sync");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put('/add', async (req, res) => {
  console.log("students/add call");
  const { index, firstName, lastName } = req.body;

  if (!index || !firstName || !lastName) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }
// TODO add years to every students, add year on request and in if statement
  try {
    const db = await connectToDatabase();
    const studentsCollection = db.collection('students');
    const student = await studentsCollection.findOne({ index });
    const group = '';
    const points = {
      test1: 0,
      test2: 0,
      reTest1: 0,
      reTest2: 0,
      exam: 0,
      project: 0
    }

    if (student) {
      res.status(401).json("Korisnik sa datim indexom vec postoji");
    } else {
      const data = { index, firstName, lastName, group, points };
      await studentsCollection.insertOne(data);
      const { _id, ...dataWithoutId } = data;
      res.status(200).json(dataWithoutId);
    }
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('/students get call');
    const db = await connectToDatabase();
    const usersCollection = db.collection('students');
    const studentsCursor = usersCollection.find();
    const students = await studentsCursor.toArray();
    // TODO check what would happen if there is a lot of students
    res.status(200).json(students);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/assignGroup', async (req, res) => {
  console.log('/students/assignGroup call');
  const { index, groupName } = req.body;

  if (!index || groupName === undefined || groupName === null) {
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  try {
    const db = await connectToDatabase();
    const studentsCollection = db.collection('students');
    const student = await studentsCollection.findOne({ index });

    if (student) {
      if (groupName) {
        const groupCollection = db.collection('groups');
        const groupExists = await groupCollection.findOne({ name: groupName });
        if (!groupExists) {
          res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
        }
      }
      await studentsCollection.updateOne({ index }, { $set: { group: groupName } });
      res.status(200).json("Grupa studenta promenjena.");
    } else {
      res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
    }
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/savePoints', async (req, res) => {
  console.log('/students/savePoints call');

  const { studentId, points } = req.body;

  if (!studentId || !points) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  if (!ObjectId.isValid(studentId)) {
    res.status(404).send('Nije validan id studenta.');
  }

  try {
    const db = await connectToDatabase();
    const studentsCollection = db.collection('students');
    const studentObjectId = new ObjectId(studentId)
    const student = await studentsCollection.findOne({ _id: studentObjectId });
    if (!student) {
      res.status(404).send('Student ne postoji.');
    }
    await studentsCollection.updateOne({ _id: studentObjectId }, { $set: { points } });
    res.status(200).json('Poeni studenta uspesno promenjeni.');
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/addCsv', upload.single('file'), async (req, res) => {
  console.log('/students/addCsv call');
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
    }
    const csvString = req.file.buffer.toString('utf-8');
    const records = parse(csvString, {
      skip_empty_lines: true,
    });
    const data = records.slice(1).map((row) => ({
      number: row[0],
      index: row[1],
      name: row[2],
      email: row[3]
    }));
    const db = await connectToDatabase();
    const studentsCollection = db.collection('students');
    const group = '';
    const points = {
      test1: 0,
      test2: 0,
      reTest1: 0,
      reTest2: 0,
      exam: 0,
      project: 0
    }

    for (const row of data) {
      const student = await studentsCollection.findOne({ index: row.index });
      const firstName = row.name.split(' ')[0];
      const lastName = row.name.split(' ')[1];
      const newStudent = { index: row.index, firstName, lastName, group, points };

      if (student) {
        await studentsCollection.updateOne({ index: row.index }, { $set: newStudent });
      } else {
        await studentsCollection.insertOne(newStudent);
      }
    }

    res.status(200).json('Korisnici uspesno dodati.');
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  console.log('/students/delete call');
  const studentId = req.params.id;

  if (!ObjectId.isValid(studentId)) {
    res.status(404).send({ error: 'Nije validan id studenta.' });
  }

  try {
    const db = await connectToDatabase();
    const studentsCollection = db.collection('students');

    const student = await studentsCollection.findOne({ _id: new ObjectId(studentId) });
    if (!student) {
      return res.status(404).json({ error: 'Student nije pronadjen.' });
    }
    const groupName = student.group;

    if (groupName) {
      const groupCollection = await db.collection('groups');
      const group = await groupCollection.findOne({ name: groupName });
      let members = [...group.members];
      members = members.filter((member) => !member.include(`${student.firstName} ${student.lastName}`));
      console.log(members);
    }

    await studentsCollection.deleteOne({ _id: new ObjectId(studentId) });
    res.status(200).send(groupName);
  } catch (e) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
