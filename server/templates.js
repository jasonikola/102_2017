const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.put('/add', async (req, res) => {
  console.log('templates/add call');
  const { name, components } = req.body;

  if (!name || !components) {
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  try {
    const db = await connectToDatabase();
    const templates = db.collection('templates');
    const template = await templates.findOne({ name });

    if (template) {
      res.status(401).json({ error: "Šablon sa datim imenom već postoji" });
    } else {
      const data = { name, components };
      await templates.insertOne(data);
      res.status(200).json(data);
    }
  } catch (e) {
    res.status(500).send({ error: 'Internal server error' });
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

router.delete('/delete/:id', async (req, res) => {
  console.log('/templates/delete call');
  const templateId = req.params.id;

  if (!ObjectId.isValid(templateId)) {
    res.status(404).send({ error: 'Nije validan id šablona.' });
  }
  try {
    const db = await connectToDatabase();
    const templatesCollection = db.collection('templates');
    const template = await templatesCollection.findOne({ _id: new ObjectId(templateId) });
    if (!template) {
      res.status(401).json({ error: 'Šablon nije pronađen.' });
    }
    await templatesCollection.deleteOne({ _id: new ObjectId(templateId) });

    res.status(200).send('Šablon je izbrisan');
  } catch (e) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

router.put('/edit/:id', async (req, res) => {
  console.log('/templates/edit call');
  const { name, components } = req.body;
  const templateId = req.params.id;
  if (!ObjectId.isValid(templateId) || !name || !components) {
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  try {
    const db = await connectToDatabase();
    const templatesCollection = db.collection('templates');
    const objectId = new ObjectId(templateId);

    const existingTemplate = await templatesCollection.findOne({ _id: objectId });
    if (!existingTemplate) {
      return res.status(404).json({ error: "Šablon nije pronađen." });
    }

    if (existingTemplate.name || name) {
      const nameExists = await templatesCollection.findOne({
        name: name,
        _id: { $ne: objectId }
      });

      if (nameExists) {
        return res.status(401).json({ error: "Šablon sa datim imenom već postoji." });
      }
    }
    await templatesCollection.updateOne(
      { _id: objectId },
      { $set: { name, components } }
    );

    const updatedTemplate = await templatesCollection.findOne({ _id: objectId });
    return res.status(200).json(updatedTemplate);
  } catch (e) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
