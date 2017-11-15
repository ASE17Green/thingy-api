const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Thingy = require('../models/thingy');

// add data to a user (user data added automaticaly)
// /adddata/:thingyID ???? depends on how we send the data
router.post('/adddata', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Thingy.create(req.body, function (err, data) {
    Thingy.checkTemperature(req.body.temperature, req.user);
    if (err) return next(err);
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
