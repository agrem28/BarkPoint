require('dotenv').config();
const mongoose = require('mongoose');

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const database = process.env.DB_DB;
const url = `mongodb+srv://${user}:${pass}@cluster0.otxhu.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.warn('we connected');
});

module.exports = db;
