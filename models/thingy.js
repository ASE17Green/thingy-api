const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const User = require('../models/user');
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
  var position = findPosition(thingy, user);
  // check if temperature message already sent or at thingy at end location
  if(!user.thingysTemperatureMessageSent[position] && user.endLocations[position] != null){
    // check for temperature borders
    if(thingy.temperature < user.thingysMinTemperature[position]){
      Thingy.sendEMail(user, 'Temperature of thingy '+thingy.thingyID+' is too low!');
      // sets the temperature message to send e-mail only once
      Thingy.setTemperatureMessageSent(user, position);
    } else if(thingy.temperature > user.thingysMaxTemperature[position]){
      Thingy.sendEMail(user, 'Temperature of thingy '+thingy.thingyID+' is too high!');
      // sets the temperature message to send e-mail only once
      Thingy.setTemperatureMessageSent(user, position);
    }
  }
}

// sets the temperature message to true for a thingy of a user
module.exports.setTemperatureMessageSent = function(user, position, err){
  user.thingysTemperatureMessageSent[position] = true;
  User.findByIdAndUpdate(user.id, user, function (err, user) {
      if (err) return next(err);
  });
}

// check if package arrived and sends an e-mail
module.exports.checkLocation = function(thingy, user, callback){
  var position = findPosition(thingy, user);
    console.log(position);
  if(thingy.location == user.endLocations[position] && user.endLocations[position] != null){
    Thingy.sendEMail(user, 'Thingy '+thingy.thingyID+' arrived!');
    // reset temperature to send e-mail only once
    Thingy.resetEndLocation(user, position);
  }
}

// resets the endlocation and messaging of a thingy defined by a user
module.exports.resetEndLocation = function(user, position, err){
  user.endLocations[position] = null;
  user.thingysTemperatureMessageSent[position] = false; // message of temperature also reset
  User.findByIdAndUpdate(user.id, user, function (err, user) {
      if (err) return next(err);
  });
}

// send an e-mail
module.exports.sendEMail = function(user, message, err){
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

// find position of thingy in user array
function findPosition(thingy, user) {
  var position = 0;
  var count = 0;
  user.thingysID.forEach(function(thingyID){
    if(thingyID == thingy.thingyID){
      position = count;
    }
    count++;
  });
  return position;
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
