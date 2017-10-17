const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Thingy = require('../models/thingy');

// get date
router.get('/date', (req, res) => {
  res.send('date');
});

// get last temperature
router.get('/temperature', (req, res) => {
  Thingy.findLastSensorData(function(err, thingy) {
    if (err) throw err;
    res.json(thingy);
    });
});

// get pressure
router.get('/pressure', (req, res) => {
  res.send('pressure');
});

// get humidity
router.get('/humidity', (req, res) => {
  res.send('humidity');
});

// get color
router.get('/color', (req, res) => {
  res.send('color');
});

// get gas
router.get('/gas', (req, res) => {
  res.send('gas');
});

// get gravity
router.get('/gravity', (req, res) => {
  res.send('gravity');
});

module.exports = router;
