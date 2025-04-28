const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");

const router = express.Router();

router.put('/add', async (req, res) => {
  console.log('/themes/add call');

  const name = req.body.name;
  if (!name) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  try {
    const db = await connectToDatabase();
    const themes = await db.collection('themes');
    const theme = await themes.findOne({ name: name });

    if(theme) {
      res.status(401).json("Vec postoji tema sa datim imenom");
    } else {
      const group = '';
      const data = { name, group };
      await themes.insertOne(data);
      const {_id, ...dataWithoutId} = data;
      res.status(200).json(dataWithoutId);
    }
  } catch (e) {
    res.status(500).json('Internal server error');
  }
});

router.get('/get', async (req, res) => {
  console.log('themes/get call');
  try {
   const db = await connectToDatabase();
   const themesCollection = await db.collection('themes');
   const themesCursor = themesCollection.find();
   const themes = await themesCursor.toArray();

   const returnValue = themes.map((theme) => {
     return {
       name: theme.name,
       members: theme.members
     };
   });
   res.status(200).json(returnValue);
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
