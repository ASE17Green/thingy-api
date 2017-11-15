const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Schema = mongoose.Schema;

// Thingy Schema
const ThingySchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  thingyID:{
    type: String
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

module.exports.checkTemperature = function(temperature, user){
  // todo
}

module.exports.getThingyById = function(id, callback){
  Thingy.findById(id, callback);
}

module.exports.getCertainThingyDataByUser = function(user, thingyID, callback){
  const query = {thingyID: thingyID}
  Thingy.find({user: user}, function(err, docs){
      Thingy.find(query, callback);
  });
}

module.exports.getLastDataOfCertainThingyByUser = function(user, thingyID, callback){
  const query = {thingyID: thingyID}
  Thingy.find({user: user}, function(err, docs){
      Thingy.findOne(query, callback).sort({date:-1});
  });
}

module.exports.removeCertainThingyDataOfUser = function(user, thingyID, callback){
  const query = {thingyID: thingyID}
  Thingy.find({user: user}, function(err, docs){
      Thingy.remove(query, callback);
  });
}
