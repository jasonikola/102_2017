const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { authMiddleware } = require('./middleware');

const userRoutes = require('./users');
const studentsRoutes = require('./students');
const groupsRoutes = require('./groups');
const themesRoutes = require('./themes');
const componentsRoutes = require('./components');
const templatesRoutes = require('./templates');
const pointsRoutes = require('./points');
const authRoutes = require('./auth');
require('dotenv').config();

const app = express();

const port = process.env.API_PORT || 3002;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/students', authMiddleware, studentsRoutes);
app.use('/groups', authMiddleware, groupsRoutes);
app.use('/themes', authMiddleware, themesRoutes);
app.use('/components', authMiddleware, componentsRoutes);
app.use('/templates', authMiddleware, templatesRoutes);
app.use('/points', pointsRoutes);
// TODO check for return of server calls

app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
