const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Thingy = require('../models/thingy');

// get date
router.get('/date', (req, res, next) => {
  res.send('date');
});

// get temperature
router.get('/temperature', (req, res, next) => {
  res.send('temperature');
});

// get pressure
router.get('/pressure', (req, res, next) => {
  res.send('pressure');
});

// get humidity
router.get('/humidity', (req, res, next) => {
  res.send('humidity');
});

// get color
router.get('/color', (req, res, next) => {
  res.send('color');
});

// get gas
router.get('/gas', (req, res, next) => {
  res.send('gas');
});

// get gravity
router.get('/gravity', (req, res, next) => {
  res.send('gravity');
});

module.exports = router;
