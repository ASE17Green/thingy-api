const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Thingy = require('../models/thingy');

// add data
router.post('/data', (req, res, next) => {
  Thingy.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// delete all data
router.delete('/datas', function(req, res, next) {
  Thingy.remove(function (err, datas) {
    if (err) return next(err);
    res.json({sucess: true, msg: 'All datas deleted'});
  });
});

// get last data
router.get('/lastdata', (req, res) => {
  Thingy.findOne({}, {}, {sort:{date:-1}}, function(err, thingy) {
    if (err) throw err;
      res.json(thingy);
  });
});

// get all data
router.get('/data', function(req, res, next) {
  Thingy.find(function (err, datas) {
    if (err) return next(err);
    res.json(datas);
  });
});


module.exports = router;
