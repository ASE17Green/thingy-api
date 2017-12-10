const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Thingy = require('../models/thingy');
const UserThingy = require('../models/userthingy');

// add data to a user (user data added automaticaly)
router.post('/adddata', (req, res, next) => {
  Thingy.getUserOfThingy(req.body.thingyID, (err, userdata) => {
    if (err) throw err;
    let newThingy = new Thingy({
        user: userdata,
        thingyID: req.body.thingyID,
        date: new Date(),
        temperature: req.body.temperature,
        pressure: req.body.pressure,
        humidity: req.body.humidity,
        eco2: req.body.eco2,
        tvoc: req.body.tvoc,
        colorRed: req.body.colorRed,
        colorGreen: req.body.colorGreen,
        colorBlue: req.body.colorBlue,
        colorAlpha: req.body.colorAlpha,
        button: req.body.button,
        tapDirection: req.body.tapDirection,
        tapCount: req.body.tapCount,
        orientation: req.body.orientation,
        accelerometerX: req.body.accelerometerX,
        accelerometerY: req.body.accelerometerY,
        accelerometerZ: req.body.accelerometerZ,
        latitude: req.body.latitude,
        longitude: req.body.longitude
    });
    if(newThingy.user == null){
      res.json({success: false, msg: 'No user found that has the thingyID: '+newThingy.thingyID});
    } else {
      UserThingy.getUserThingyByID(newThingy.thingyID, function (err, userThingy) {
        //if thingy arrived post no more data
        if (err) return next(err);
        if(!userThingy.packageArrivedMessageSent){
          Thingy.create(newThingy, function (err, data) {
            if (err) return next(err);
            // check start, temperature & location
            Thingy.checkDeliveryStart(newThingy);
            Thingy.checkTemperature(newThingy);
            Thingy.checkLocation(newThingy);
            res.json(data);
          });
        } else {
          res.json({success: false, msg: 'Thingy: '+newThingy.thingyID+' arrived. No longer sending datas.'});
        }
      });
    }
  });
});

// delete all data of a thingy of a user
router.delete('/deletedata/:thingyID', passport.authenticate('jwt', {session:false}), function(req, res, next) {
  Thingy.removeCertainThingyDataOfUser(req.user, req.params.thingyID, (err, datas) =>  {
    if (err) return next(err);
    res.json({success: true, msg: 'All datas of thingy '+req.params.thingyID+' deleted'});
  });
});

// get last data of a thingy of a user
router.get('/lastdata/:thingyID', passport.authenticate('jwt', {session:false}), (req, res) => {
  Thingy.getLastDataOfCertainThingyByUser(req.user, req.params.thingyID, (err, data) => {
    if (err) throw err;
      res.json(data);
  });
});

// get all data of a thingy of a user
router.get('/data/:thingyID', passport.authenticate('jwt', {session:false}), function(req, res, next) {
  Thingy.getCertainThingyDataByUser(req.user, req.params.thingyID, (err, datas) =>  {
    if (err) return next(err);
    res.json(datas);
  });
});

module.exports = router;
