const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Thingy = require('../models/thingy');

// add data to a user (user data added automaticaly)
router.post('/data', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Thingy.create(req.body, function (err, data) {
    if (err) return next(err);
    data.set({user: req.user});
    data.save(function (err, userdata) {
      if (err) return next(err);
      res.send(userdata);
    });
  });
});

// delete all data of a user
router.delete('/data', passport.authenticate('jwt', {session:false}), function(req, res, next) {
  const user = req.user;
  Thingy.removeThingysOfUser(user, (err, datas) =>  {
    if (err) return next(err);
    res.json({sucess: true, msg: 'All datas deleted'});
  });
});

// get last data of a user
router.get('/lastdata', passport.authenticate('jwt', {session:false}), (req, res) => {
  const user = req.user;
  Thingy.getLastThingyByUser(user, (err, data) => {
    if (err) throw err;
      res.json(data);
  });
});

// get all data of user
router.get('/data', passport.authenticate('jwt', {session:false}), function(req, res, next) {
  const user = req.user;
  Thingy.getThingysByUser(user, (err, datas) =>  {
    if (err) return next(err);
    res.json(datas);
  });
});

module.exports = router;
