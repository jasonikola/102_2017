const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");

const router = express.Router();

router.put('/add', async (req, res) => {
  console.log('templates/add call');
  const { name, components } = req.body;

  if (!name || !components) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  try {
    const db = await connectToDatabase();
    const templates = db.collection('templates');
    const template = await templates.findOne({ name });

    if (template) {
      res.status(401).json("Sablon sa datim imenom vec postoji");
    } else {
      const data = { name, components };
      await templates.insertOne(data);
      res.status(200).json(data);
    }
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.get('/', async (req, res) => {
  console.log('/templates get call');
  try {
    const db = await connectToDatabase();
    const templatesCollection = db.collection('templates');
    const templatesCursor = templatesCollection.find();
    const templates = await templatesCursor.toArray();

    res.status(200).json(templates);
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
