const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const UserThingy = require('../models/userthingy');
const Thingy = require('../models/thingy');

// add a userThingy to the user
router.post('/addUserThingy', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  let newUserThingy = new UserThingy({
    userID: req.user.id,
    thingyID: req.body.thingyID,
    thingyMinTemperature: req.body.thingyMinTemperature,
    thingyMaxTemperature: req.body.thingyMaxTemperature,
    thingyTemperatureMessageSent: false,
    endLatitude: req.body.endLatitude,
    endLongitude: req.body.endLongitude,
    packageArrivedMessageSent: false,
    packageStartedMessageSent: false
  });
  UserThingy.create(newUserThingy, function (err, userThingy) {
    if (err){
      if(err.message == 'UserThingy validation failed: thingyID: Error, thingy already in use'){
        res.json({success: false, msg: 'Thingy exists already'});
      }else{
        res.json({success: false, msg: 'Failed to add thingy'});
      }
    } else {
      let newUser = req.user;
      newUser.userThingys.push(newUserThingy.thingyID);
      User.findByIdAndUpdate(req.user.id, newUser, {new: true}, function (err, user) {
          if (err) return next(err);
      });
      res.json(userThingy);
    }
  });
});

// get all userThingys (with authentication)
router.get('/userThingy/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    UserThingy.getAllUserThingys(req.user.id, function (err, userThingys) {
      if (err) return next(err);
      if(userThingys == null){
        res.json({success: false, msg: 'No Thingy found'});
      }else {
        res.json(userThingys);
      }
    });
});

// get a userThingy (with authentication)
router.get('/userThingy/:userThingyID', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    UserThingy.getUserThingyByID(req.params.userThingyID, function (err, userThingy) {
      if (err) return next(err);
      if(userThingy == null){
        res.json({success: false, msg: 'Thingy not found'});
      }else if(userThingy.userID == req.user.id){
        res.json(userThingy);
      } else {
        res.json({success: false, msg: 'Access denied'});
      }
    });
});

// delete a userThingy (with authentication)
router.delete('/delete/:userThingyID', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    UserThingy.getUserThingyByID(req.params.userThingyID, function (err, userThingy) {
      if (err) return next(err);
      if(userThingy == null){
        res.json({success: false, msg: 'Thingy not found'});
      } else if(userThingy.userID == req.user.id){
        UserThingy.removeUserThingyByID(req.params.userThingyID, function (err) {
          if (err) return next(err);
          // remove thingyID from user
          let newUser = req.user;
          var index = newUser.userThingys.indexOf(userThingy.thingyID);
          newUser.userThingys.splice(index, 1);
          User.findByIdAndUpdate(req.user.id, newUser, {new: true}, function (err, user) {
              if (err) return next(err);
              // delete data from thingys db
              Thingy.removeCertainThingyDataOfUser(newUser, req.params.userThingyID, (err, datas) =>  {
                if (err) return next(err);
              });
          });
          res.json({success: true, msg: 'UserThingy deleted: '+req.params.userThingyID});
        });
      } else {
        res.json({success: false, msg: 'Access denied'});
      }
    });
});

// update a userThingy (with authentication)
router.put('/update/:userThingyID', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    UserThingy.getUserThingyByID(req.params.userThingyID, function (err, userThingy) {
      if (err) return next(err);
      if(userThingy == null){
        res.json({success: false, msg: 'Thingy not found'});
      }else if(userThingy.userID == req.user.id){
        req.body.thingyID = userThingy.thingyID; // makes sure the user can't chang the thingy id
        UserThingy.findByIdAndUpdate(userThingy.id, req.body, {new: true}, function (err, user) {
          if (err) return next(err);
          res.json(user);
        });
      } else {
        res.json({success: false, msg: 'Access denied'});
      }
    });
});

module.exports = router;
