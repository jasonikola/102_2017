const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require("./DatabaseConnection");
const { authMiddleware } = require("./middleware");

const router = express.Router();

function createAccessToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );
}

function createRefreshToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES });
}

router.post('/login', async (req, res) => {
  console.log('/auth/login call')
  try {
    const { email, password } = req.body;
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });
    const badCredentials = "Email ili lozinka nisu tačni.";

    if (!user) {
      res.status(401).send({ error: badCredentials });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).send({ error: badCredentials });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);


    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).send('Profesor uspesno prijavljen.')
  } catch (error) {
    res.status(500).send({ error: 'Internal server Error' });
  }
});

router.post("/logout", (req, res) => {
  console.log('/auth/login call');

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).send('Profesor uspesno odjavljen.');
});

router.post('/refresh', (req, res) => {
  console.log('/auth/refresh call');
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: 'Greska sa refresh tokenom.' });
    // TODO chech all messages
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = createAccessToken(decoded.id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token uspesno osvezen" });
  } catch (error) {
    res.status(500).send({ error: 'Internal server Error' });
  }
});

router.get("/me", (req, res) => {
  console.log('/auth/me call');
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Korisnik nije prijavljen." });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).send('Korisnik prijavljen.');
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.get("/check", authMiddleware, (req, res) => {
  console.log('/auth/check call');
  res.sendStatus(200);
});

module.exports = router;
