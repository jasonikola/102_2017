const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");
const { ObjectId } = require("mongodb");

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
      const data = { name, members };
      await groups.insertOne(data);
      const { _id, ...dataWithoutId } = data;
      res.status(200).json(dataWithoutId);
    }
  } catch (e) {
    res.status(500).json('Internal server error');
  }
});

router.get('/', async (req, res) => {
  console.log('/groups get call');
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
          ...group,
          members: members
        };
      })
    );
    res.status(200).json(returnValue);
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


router.post('/assignTheme', async (req, res) => {
  console.log('/groups/assignTheme call');
  const { groupName, themeName } = req.body;
  if (!groupName || themeName === undefined || themeName === null) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  try {
    const db = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const group = await groupsCollection.findOne({ name: groupName });
    // TODO check after templateName -> groupName change
    const themesCollection = db.collection('themes');
    const theme = await themesCollection.findOne({ name: themeName });

    if (group || themeName === '' || (themeName && theme)) {
      if (themeName !== '') {
        await themesCollection.updateOne({ name: themeName }, { $set: { group: groupName } });
      } else {
        await themesCollection.updateOne({ group: groupName }, { $set: { group: '' } });
      }
      await groupsCollection.updateOne({ name: groupName }, { $set: { theme: themeName } });

      res.status(200).json('Tema grupe uspesno promenjena');
    } else {
      res.status(400).json("Došlo je do greške, pokušajte ponovo.");
    }
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/assignComponents', async (req, res) => {
  console.log('/groups/assignComponents call');
  const { _id, components } = req.body;
  if (!_id || !components) {
    res.status(400).json("Došlo je do greške, pokušajte ponovo.");
  }

  if (!ObjectId.isValid(_id)) {
    res.status(404).send('Nije validan id grupe.');
  }

  try {
    const db = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const group = await groupsCollection.findOne({ _id: new ObjectId(_id) });

    if (!group) {
      res.status(404).send('Grupa ne postoji.');
    }

    const componentsCollection = db.collection('components');
    const componentsCursor = await componentsCollection.find();
    const allComponents = await componentsCursor.toArray();
    let groupComponents = group.components;

    for (const groupComponent of groupComponents) {
      const stillExists = components.find(component => component._id.toString() === groupComponent._id.toString());
      if (!stillExists) {
        const globalComponent = allComponents.find(gc => gc._id.toString() === groupComponent._id.toString());
        if (globalComponent) {
          globalComponent.assigned -= groupComponent.quantity;
          await componentsCollection.updateOne({ _id: new ObjectId(globalComponent._id) }, { $inc: { assigned: -globalComponent.quantity } });
        } else {
          res.status(404).send('Komponenta ne postoji.');
        }
      }
    }

    groupComponents = groupComponents.filter(groupComponent => components.some(component => component._id.toString() === groupComponent._id.toString()));
    group.components = groupComponents;

    for (const component of components) {
      let decrement = 0;
      const groupComponent = groupComponents.find((gComponent) => gComponent._id.toString() === component._id.toString());
      if (groupComponent) {
        decrement = groupComponent.quantity;
        groupComponent.quantity = component.quantity;
      } else {
        group.components.push(component);
      }
      const componentGlobal = allComponents.find((aComponent) => aComponent._id.toString() === component._id.toString());
      if (!componentGlobal) {
        res.status(404).send('Komponenta ne postoji.');
      }
      componentGlobal.assigned -= decrement;
      componentGlobal.assigned += component.quantity;
console.log(componentGlobal);
      await componentsCollection.updateOne({ _id: new ObjectId(componentGlobal._id) }, { $set: { assigned: componentGlobal.assigned } });
    }

    await groupsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { components: group.components } });

    res.status(200).json(group);
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
