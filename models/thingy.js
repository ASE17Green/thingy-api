const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Thingy Schema
const ThingySchema = mongoose.Schema({
  thingyDate: {
    type: Date
  },
  temperature: {
    type: Number
  },
  pressure: {
    type: Number
  },
  humidity: {
    type: Number
  },
  color: {
    type: Number
  },
  gas: {
    type: Number
  },
  gravity: {
    type: Number
  }
});

const Thingy = module.exports = mongoose.model('Thingy', ThingySchema);

module.exports.getThingyById = function(id, callback){
  Thingy.findById(id, callback);
}

module.exports.findLastSensorData = function(callback){
  Thingy.findOne().sort({thingyDate: -1}).exec(function(err, post){
    return post;
  });
}
