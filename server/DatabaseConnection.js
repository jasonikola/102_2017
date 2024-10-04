const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectToDatabase = async () => {
  if (db) {
    return db;
  }

  const uri = process.env.DATABASE_URI || 'mongodb://localhost:27017/ardunent';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    db = client.db();
    console.log("Connected to Database");
    return db;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { connectToDatabase };