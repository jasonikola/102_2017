const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { connectToDatabase } = require("./DatabaseConnection");
const { ObjectId } = require('mongodb');

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
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  try {
    const db = await connectToDatabase();
    const componentsCollection = await db.collection('components');

    const fileName = file.filename;
    const safeName = name.replace(/[<>:"/\\|?*]/g, '-');
    const ext = path.extname(file.originalname);
    const newFileName = `${Date.now()}-${safeName}${ext}`;
    const oldPath = path.join(uploadDir, fileName);
    const newPath = path.join(uploadDir, newFileName);
    fs.renameSync(oldPath, newPath);

    const imagePath = `images/${newFileName}`;

    const data = {
      name,
      quantity: parseInt(quantity),
      image: imagePath,
      assigned: 0
    }
    await componentsCollection.insertOne(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  console.log('/components get call');
  try {
    const db = await connectToDatabase();
    const componentsCollection = await db.collection('components');
    const componentsCursor = await componentsCollection.find();
    const components = await componentsCursor.toArray();

    res.status(200).json(components);
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  console.log('/components/delete call');
  const componentId = req.params.id;

  if (!ObjectId.isValid(componentId)) {
    res.status(404).json({ error: 'Nije validan id komponente.' });
  }

  try {
    const db = await connectToDatabase();
    const componentsCollection = await db.collection('components');

    const component = await componentsCollection.findOne({ _id: new ObjectId(componentId) });

    if (!component) {
      return res.status(404).json({ error: 'Komponenta nije pronađena.' });
    }

    const imagePath = path.join(__dirname, component.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await componentsCollection.deleteOne({ _id: new ObjectId(componentId) });

    res.status(200).json({ message: 'Komponente uspešno obrisana.' });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
