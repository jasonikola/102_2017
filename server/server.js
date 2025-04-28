const cors = require('cors');
const express = require('express');
const userRoutes = require('./users');
const studentsRoutes = require('./students');
const groupsRoutes = require('./groups');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/students', studentsRoutes);
app.use('/groups', groupsRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
