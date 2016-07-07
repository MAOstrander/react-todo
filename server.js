'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const routes = require('./routes/'); // Instead of putting all my routes in the server, I keep them in a different index file.

// Basic config to access the MongoDB online or on a local machine
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_URL_PREFIX = MONGODB_USER
  ? `${MONGODB_USER}:${MONGODB_PASS}@`
  : '';
const MONGO_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/todo`;

// Since I'm using HTML I want to go ahead and serve up the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
// bodyParser to make sure I can easily find and work with forms and posted data.
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json() );

app.use(routes);

// Open the server on PORT once a connection to the database is established
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}.`);
  });
});
