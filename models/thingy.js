const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const User = require('../models/user');
const UserThingy = require('../models/userthingy');
const nodemailer = require('nodemailer');
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
  eco2: {
    type: Number
  },
  tvoc: {
    type: Number
  },
  colorRed: {
    type: Number
  },
  colorGreen: {
    type: Number
  },
  colorBlue: {
    type: Number
  },
  colorAlpha: {
    type: Number
  },
  button: {
    type: Number
  },
  tapDirection: {
    type: Number
  },
  tapCount: {
    type: Number
  },
  orientation: {
    type: Number
  },
  accelerometerX: {
    type: Number
  },
  accelerometerY: {
    type: Number
  },
  accelerometerZ: {
    type: Number
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  }
});

const Thingy = module.exports = mongoose.model('Thingy', ThingySchema);

// check if temperature too low or high and sends an e-mail
module.exports.checkTemperature = function(thingy, callback){
  UserThingy.getUserThingyByID(thingy.thingyID, function (err, userThingy) {
    if (err) return next(err);
    // check if temperature message already sent or at thingy at end location
    if(!userThingy.thingyTemperatureMessageSent && !userThingy.packageArrivedMessageSent){
      // check for temperature borders
      if(thingy.temperature < userThingy.thingyMinTemperature){
        Thingy.sendEMail(thingy, 'Temperature of thingy '+thingy.thingyID+' is too low!');
        // sets the temperature message to send e-mail only once
        Thingy.setTemperatureMessageSent(userThingy);
      } else if(thingy.temperature > userThingy.thingyMaxTemperature){
        Thingy.sendEMail(thingy, 'Temperature of thingy '+thingy.thingyID+' is too high!');
        // sets the temperature message to send e-mail only once
        Thingy.setTemperatureMessageSent(userThingy);
      }
    }
  });
}

// sets the temperature message to true for a thingy of a user
module.exports.setTemperatureMessageSent = function(userThingy, err){
  userThingy.thingyTemperatureMessageSent = true;
  UserThingy.findByIdAndUpdate(userThingy.id, userThingy, function (err, user) {
    if (err) return next(err);
  });
}

// check if package arrived and sends an e-mail
module.exports.checkLocation = function(thingy, callback){
  UserThingy.getUserThingyByID(thingy.thingyID, function (err, userThingy) {
    if (err) return next(err);
    if(thingy.latitude == userThingy.endLatitude && thingy.longitude == userThingy.endLongitude && !userThingy.packageArrivedMessageSent){
      Thingy.sendEMail(thingy, 'Thingy '+thingy.thingyID+' arrived!');
      // reset temperature to send e-mail only once
      Thingy.setPackageArrivedMessageSent(userThingy);
    }
  });
}

// sets the "package arrived" message to true for a thingy of a user
module.exports.setPackageArrivedMessageSent = function(userThingy, err){
  userThingy.packageArrivedMessageSent = true;
  UserThingy.findByIdAndUpdate(userThingy.id, userThingy, function (err, user) {
    if (err) return next(err);
  });
}

// send an e-mail
module.exports.sendEMail = function(thingy, message, err){
  let user = thingy.user;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thingy.green@gmail.com',
      pass: 'thingysareamazing'
    }
  });
  var mailOptions = {
    from: 'thingy.green@gmail.com', // sender address
    to: user.email, // receiver
    subject: 'Thingy Notification', // subject line
    text: message  // message
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: '+message);
    };
  });
}

module.exports.getThingyById = function(id, callback){
  Thingy.findById(id, callback);
}

module.exports.getUserOfThingy = function(thingyID, callback){
  const query = {userThingys: thingyID}
  User.findOne(query, callback);
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
