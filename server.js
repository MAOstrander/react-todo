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

app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json() );
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));


// Break this out into a new file soon
const Task = require('./model/task');

function getTasks(req, res) {
  Task.find().exec( (err, doc) => {
    if (err) throw err;

    const whoops = [
      {id: 0, label: 'Whoops, someone disconnected the database!', completed: false}
    ];
    if (doc) {
      res.send(doc);
    } else {
      res.send(whoops);
    }
  });
}

app.get('/api/comments', (req, res) => {
  getTasks(req, res);
});

app.post('/api/add', (req, res) => {

  const myTest = new Task({
    label: req.body.label,
    completed: req.body.completed
  });

  myTest.save( (err) => {
    if (err) throw err;

    getTasks(req, res);
  });

});

///
app.post('/api/edit', (req, res) => {
  let searchID = req.body.idToEdit;
  let upKey = req.body.updateKey;
  let upValue = req.body.updateValue;
  upValue = upValue === 'true' ? true : upValue;

  Task.findOne({"_id":searchID}, (err, doc) => {
    if (err) throw err;

    if(doc) {
      doc[upKey] = upValue;
      doc.save();

      res.send(doc);
    } else {
      res.send("Whoops, the update failed");
    }

  })
})

app.delete('/api/delete', (req, res) => {
  let searchID = req.body.idToDelete;
  Task.remove( {"_id": searchID}, (err, doc) => {
    if (err) throw err;

    if (doc) {
      res.send(doc);
    } else {
      res.send(err);
    }
  })
});

mongoose.connect(MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}.`);
  });
});
