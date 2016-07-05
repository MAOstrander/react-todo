'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
process.env.NODE_ENV = 'production';

const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_URL_PREFIX = MONGODB_USER
  ? `${MONGODB_USER}:${MONGODB_PASS}@`
  : '';
//mongodb://<dbuser>:<dbpassword>@ds051575.mlab.com:51575/todo
const MONGO_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/todo`;

// app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json() );



// Break this out into a new file soon
const Task = require('./model/task');
app.get('/', (req, res) => {

  const myTest = new Task({
    label: "Testing",
    completed: false
  });

  console.log("myTest", myTest);

  myTest.save( (err) => {
    if (err) throw err;


    res.sendFile('/index.html');

  });

});


mongoose.connect(MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}. Supposedly connected to database`);
  });
});
