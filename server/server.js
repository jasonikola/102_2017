const cors = require('cors');
const express = require('express');
const path = require('path');
const userRoutes = require('./users');
const studentsRoutes = require('./students');
const groupsRoutes = require('./groups');
const themesRoutes = require('./themes');
const componentsRoutes = require('./components');
const templatesRoutes = require('./templates');
const pointsRoutes = require('./points');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3002;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/students', studentsRoutes);
app.use('/groups', groupsRoutes);
app.use('/themes', themesRoutes);
app.use('/components', componentsRoutes);
app.use('/templates', templatesRoutes);
app.use('/points', pointsRoutes);
// TODO check for return of server calls

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
