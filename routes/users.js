const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) =>{
    if(err){
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});

// get all users
router.get('/', function(req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

// delete a user
router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
    if (err) return next(err);
    res.json({success: true, msg: 'User deleted'});
  });
});

// delete all users
router.delete('/', function(req, res, next) {
  User.remove(function (err, users){
    if(err) return next(err);
    res.json({success: true, msg: 'All users deleted'});
  });
});

// authenticate
router.post('/authenticate', (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  User.getUserByName(name, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT ' +token,
          user: {
            id: user._id,
            name: user.name
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// profile function with limited authorization
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
