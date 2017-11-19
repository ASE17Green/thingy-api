const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const User = require('../models/user');
const Schema = mongoose.Schema;

// Thingy Schema
const ThingySchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  thingyID:{
    type: String,
    required: true
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
  },
  location: {
    type: Number
  }
});

const Thingy = module.exports = mongoose.model('Thingy', ThingySchema);

// check if temperature too low or high and sends an e-mail
module.exports.checkTemperature = function(thingy, user, callback){
  var position = 0;
  var count = 0;
  user.thingysID.forEach(function(thingyID){
    if(thingyID == thingy.thingyID){
      position = count;
    }
    count++;
  });
  if(thingy.temperature < user.thingysMinTemperature[position] && user.thingysMinTemperature[position] != null){
    console.log('Send an e-mail: Temperature too low');
    // reset temperature to send e-mail only once
    Thingy.resetTemperature(user, position);
  } else if(thingy.temperature > user.thingysMaxTemperature[position] && user.thingysMaxTemperature[position] != null){
    console.log('Send an e-mail: Temperature too high');
    // reset temperature to send e-mail only once
    Thingy.resetTemperature(user, position);
  }
}

// resets the temperature bounds defined by a user for a thingy
module.exports.resetTemperature = function(user, position, err){
  user.thingysMinTemperature[position] = null;
  user.thingysMaxTemperature[position] = null;
  User.findByIdAndUpdate(user.id, user, function (err, user) {
      if (err) return next(err);
  });
}

// check if package arrived and sends an e-mail
module.exports.checkLocation = function(thingy, user, callback){
  var position = 0;
  var count = 0;
  user.thingysID.forEach(function(thingyID){
    if(thingyID == thingy.thingyID){
      position = count;
    }
    count++;
  });
  if(thingy.location == user.endLocations[position] && user.endLocations[position] != null){
    console.log('Send an e-mail: Package arrived!');
    // reset temperature to send e-mail only once
    Thingy.resetEndLocation(user, position);
  }
}

// resets the endlocation of a thingy defined by a user
module.exports.resetEndLocation = function(user, position, err){
  user.endLocations[position] = null;
  User.findByIdAndUpdate(user.id, user, function (err, user) {
      if (err) return next(err);
  });
}

module.exports.getThingyById = function(id, callback){
  Thingy.findById(id, callback);
}

// returns all data of a thingy for a certain user
module.exports.getCertainThingyDataByUser = function(user, thingyID, callback){
  const query = {thingyID: thingyID}
  Thingy.find({user: user}, function(err, docs){
      Thingy.find(query, callback);
  });
}

// returns last data of a thingy for a certain user
module.exports.getLastDataOfCertainThingyByUser = function(user, thingyID, callback){
  const query = {thingyID: thingyID}
  Thingy.find({user: user}, function(err, docs){
      Thingy.findOne(query, callback).sort({date:-1});
  });
}

// delets all data of a thingy for a certain user
module.exports.removeCertainThingyDataOfUser = function(user, thingyID, callback){
  const query = {thingyID: thingyID}
  Thingy.find({user: user}, function(err, docs){
      Thingy.remove(query, callback);
  });
}
