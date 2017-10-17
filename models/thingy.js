const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Thingy Schema
const ThingySchema = mongoose.Schema({
  date: {
    type: Number
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

module.exports.getThingyByName = function(name, callback){
  const query = {name: name}
  Thingy.findById(id, callback);
}

module.exports.addThingy = function(newThingy, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newThingy.password, salt, (err, hash) => {
      if(err) throw err;
      newThingy.password = hash;
      newThingy.save(callback);
    });
  });
}
