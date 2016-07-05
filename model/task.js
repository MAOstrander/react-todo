'use strict';
const mongoose = require('mongoose');

module.exports = mongoose.model('task',
  mongoose.Schema({
    label: String,
    completed: Boolean
  })
);
