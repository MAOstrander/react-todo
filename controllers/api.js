'use strict';
const Task = require('../model/task');

// This function simply gets all the todos and sends them back
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

// Once the app renders, load the todos and repopulate the app with them
module.exports.init = (req, res) => {
  getTasks(req, res);
};

// Once you add a new todo, get all the todos and send them to app
module.exports.add = (req, res) => {
  const myTest = new Task({
    label: req.body.label,
    completed: req.body.completed
  });

  myTest.save( (err) => {
    if (err) throw err;

    getTasks(req, res);
  });
};

// This will save changes to completion or changes in the text to the database
module.exports.edit = (req, res) => {
  let searchID = req.body.idToEdit;
  let upKey = req.body.updateKey;
  let upValue = req.body.updateValue;
  upValue = upValue === 'true' ? true : upValue; // If completed === true, make sure it's a Boolean instead of a String

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
};

// This fully removes the task from the database, based on the unique ID
module.exports.del = (req, res) => {
  let searchID = req.body.idToDelete;
  Task.remove( {"_id": searchID}, (err, doc) => {
    if (err) throw err;

    if (doc) {
      res.send(doc);
    } else {
      res.send(err);
    }
  })
};
