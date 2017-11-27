const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Thingy = require('../models/thingy');

// add data to a user (user data added automaticaly)
router.post('/adddata', (req, res, next) => {
  Thingy.create(req.body, function (err, data) {
    if (err) 
    {
      console.log(err);
      return next(err);
    }
    // check temperature & location
    Thingy.checkTemperature(req.body, req.user);
    Thingy.checkLocation(req.body, req.user);
    data.set({user: req.user});
    data.save(function (err, userdata) {
      if (err) return next(err);
      res.send(userdata);
    });
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
