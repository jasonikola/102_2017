const express = require('express');
const { connectToDatabase } = require("./DatabaseConnection");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.put('/add', async (req, res) => {
  console.log('/groups/add call');
  const name = req.body.name;

  if (!name) {
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  try {
    const db = await connectToDatabase();
    const groups = db.collection('groups');
    const group = await groups.findOne({ name: name });

    if (group) {
      res.status(401).json({ error: "Vec postoji grupa sa datim imenom" });
    } else {
      const members = [];
      const components = [];
      const data = { name, members, components, theme: '' };
      await groups.insertOne(data);
      res.status(200).json(data);
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  console.log('/groups get call');
  try {
    const db = await connectToDatabase();
    const groupsCollection = await db.collection('groups');
    const groupsCursor = groupsCollection.find();
    const groups = await groupsCursor.toArray();

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
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/assignTheme', async (req, res) => {
  console.log('/groups/assignTheme call');
  const { groupName, themeName } = req.body;
  if (!groupName || themeName === undefined || themeName === null) {
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  try {
    const db = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const group = await groupsCollection.findOne({ name: groupName });
    const themesCollection = db.collection('themes');
    const theme = await themesCollection.findOne({ name: themeName });

    if (group || themeName === '' || (themeName && theme)) {
      if (themeName !== '') {
        await themesCollection.updateOne({ name: themeName }, { $set: { group: groupName } });
      } else {
        await themesCollection.updateOne({ group: groupName }, { $set: { group: '' } });
      }
      await groupsCollection.updateOne({ name: groupName }, { $set: { theme: themeName } });

      res.status(200).json({ message: 'Tema grupe uspešno promenjena.' });
    } else {
      res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/assignComponents', async (req, res) => {
  console.log('/groups/assignComponents call');
  const { _id, components } = req.body;
  if (!_id || !components) {
    res.status(400).json({ error: "Došlo je do greške, pokušajte ponovo." });
  }

  if (!ObjectId.isValid(_id)) {
    res.status(404).json({ error: 'Nije validan id grupe.' });
  }

  try {
    const db = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const group = await groupsCollection.findOne({ _id: new ObjectId(_id) });

    if (!group) {
      res.status(404).json({ error: 'Grupa ne postoji.' });
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
          const assigned = globalComponent.assigned - groupComponent.quantity;
          await componentsCollection.updateOne({ _id: new ObjectId(globalComponent._id) }, { $set: { assigned: assigned } });
        } else {
          res.status(404).json({ error: 'Komponenta ne postoji.' });
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
        res.status(404).json({ error: 'Komponenta ne postoji.' });
      }
      componentGlobal.assigned -= decrement;
      componentGlobal.assigned += component.quantity;
      await componentsCollection.updateOne({ _id: new ObjectId(componentGlobal._id) }, { $set: { assigned: componentGlobal.assigned } });
    }

    await groupsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { components: group.components } });

    res.status(200).json(group);
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  console.log('/groups/delete call');
  const groupId = req.params.id;

  if (!ObjectId.isValid(groupId)) {
    res.status(404).json({ error: 'Nije validan id grupe.' });
  }

  try {
    const db = await connectToDatabase();
    const groupsCollection = db.collection('groups');
    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });

    if (!group) {
      return res.status(404).json({ error: 'Grupa nije pronađena.' });
    }

    if (group.components.length) {
      const components = group.components;
      const componentsCollection = db.collection('components');
      for (const component of components) {
        const dbComponent = await componentsCollection.findOne({ _id: new ObjectId(component._id) });
        if (!dbComponent) {
          res.status(401).json({ error: 'Došlo je do greške.' });
        }
        dbComponent.assigned -= component.quantity;
        await componentsCollection.updateOne({ _id: new ObjectId(dbComponent._id) }, { $set: { assigned: dbComponent.assigned } });
      }
    }

    if (group.theme) {
      const themes = db.collection('themes');
      await themes.updateOne({ name: group.theme }, { $set: { group: '' } });
    }

    const studentsCollection = db.collection('students');
    await studentsCollection.updateMany({ group: group.name }, { $set: { group: '' } });

    await groupsCollection.deleteOne({ _id: new ObjectId(groupId) });
    res.status(200).json({ message: 'Grupa uspešno isbrisana.' });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
