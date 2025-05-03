const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { connectToDatabase } = require("./DatabaseConnection");

const router = express.Router();

const uploadDir = path.join(__dirname, 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage });

router.post('/add', upload.single('image'), async (req, res) => {
  console.log('/components/add call');
  const { name, quantity } = req.body;
  const { file } = req;

  if (!name || quantity === undefined || quantity === null || !file) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  try {
    const db = await connectToDatabase();
    const componentsCollection = await db.collection('components');

    const fileName = file.filename;
    const ext = path.extname(file.originalname);
    const newFileName = `${Date.now()}-${name}${ext}`;
    const oldPath = path.join(uploadDir, fileName);
    const newPath = path.join(uploadDir, newFileName);
    fs.renameSync(oldPath, newPath);

    const imagePath = `images/${newFileName}`;

    const data = {
      name,
      quantity: parseInt(quantity),
      image: imagePath
    }
    await componentsCollection.insertOne(data);
    const {_id, ...dataWithoutId} = data;
    res.status(200).json(dataWithoutId);
  } catch (e) {
    res.status(500).send('Internal server error');
  }
});

router.get('/get', async (req, res) => {
  console.log('/components/get call');
  try {
    const db = await connectToDatabase();
    const componentsCollection = await db.collection('components');
    const componentsCursor = await componentsCollection.find();
    const components = await componentsCursor.toArray();
    // TODO check if many

    res.status(200).json(components);
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
