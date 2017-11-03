const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Schema = mongoose.Schema;

// Thingy Schema
const ThingySchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  date: {
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

module.exports.getThingysByUser = function(user, callback){
  const query = {user: user}
  Thingy.find(query, callback);
}

module.exports.getLastThingyByUser = function(user, callback){
  const query = {user: user}
  Thingy.findOne(query, callback).sort({date:-1});
}

module.exports.removeThingysOfUser = function(user, callback){
  const query = {user: user}
  Thingy.remove(query, callback);
}
