const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('/projectThemes get call');

  try {
    const db = await connectToDatabase();
    const themesCollection = await db.collection('themes');
    const themesCursor = themesCollection.find();
    const themes = await themesCursor.toArray();

    const returnData = themes.map(({ _id, ...rest }) => ({
      ...rest
    }));
    res.status(200).json(returnData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
