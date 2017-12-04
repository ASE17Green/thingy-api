const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const config = require('../config/database');
const Schema = mongoose.Schema;

// UserThingy Schema
const UserThingySchema = mongoose.Schema({
  userID: {
    type: String
  },
  thingyID: {
    type: String,
    required: true,
    unique: true
  },
  thingyMinTemperature: {
    type: Number
  },
  thingyMaxTemperature: {
    type: Number
  },
  thingyTemperatureMessageSent: {
    type: Boolean
  },
  endLatitude: {
    type: Number
  },
  endLongitude: {
    type: Number
  },
  packageArrivedMessageSent: {
    type: Boolean
  }
});

UserThingySchema.plugin(uniqueValidator, { message: 'Error, thingy already in use' });

const UserThingy = module.exports = mongoose.model('UserThingy', UserThingySchema);

// delets a userthingy
module.exports.getUserThingyByID = function(userThingyID, callback){
  const query = {thingyID: userThingyID}
  UserThingy.findOne(query, callback);
}

// delets a userthingy
module.exports.removeUserThingyByID = function(userThingyID, callback){
  const query = {thingyID: userThingyID}
  UserThingy.remove(query, callback);
}
