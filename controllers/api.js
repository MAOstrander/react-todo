'use strict';
const Task = require('../model/task');

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

module.exports.init = (req, res) => {
  getTasks(req, res);
};

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

module.exports.edit = (req, res) => {
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
};

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
