const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.put('/add', async (req, res) => {
  console.log('/themes/add call');

  const name = req.body.name;
  if (!name) {
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  try {
    const db = await connectToDatabase();
    const themes = await db.collection('themes');
    const theme = await themes.findOne({ name: name });

    if (theme) {
      res.status(401).json({ error: "Vec postoji tema sa datim imenom" });
    } else {
      const group = '';
      const data = { name, group };
      await themes.insertOne(data);
      const { _id, ...dataWithoutId } = data;
      res.status(200).json(dataWithoutId);
    }
  } catch (e) {
    res.status(500).json('Internal server error');
  }
});

router.get('/', async (req, res) => {
  console.log('/themes get call');
  try {
    const db = await connectToDatabase();
    const themesCollection = await db.collection('themes');
    const themesCursor = themesCollection.find();
    const themes = await themesCursor.toArray();
    res.status(200).json(themes);
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  console.log('/themes/delete call');
  const themeId = req.params.id;

  if (!ObjectId.isValid(themeId)) {
    res.status(404).json({ error: 'Nije validan id teme.' });
  }

  try {
    const db = await connectToDatabase();
    const themes = await db.collection('themes');
    const theme = await themes.findOne({ _id: new ObjectId(themeId) });
    if (!theme) {
      return res.status(404).json({ error: 'Tema nije pronadjena.' });
    }

    if (theme.group) {
      const groups = db.collection('groups');
      await groups.updateOne({ name: theme.group }, { $set: { theme: '' } });
    }

    await themes.deleteOne({ _id: new ObjectId(themeId) });

    res.status(200).send('Tema uspesno obrisana.');
  } catch (e) {
    res.status(500).send({ error: 'Internal server error' });
  }

});

module.exports = router;
