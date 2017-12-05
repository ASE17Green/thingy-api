const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const UserThingy = require('../models/userthingy');

// register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userThingys: [null]
  });
  // add only if doesn't exits
  User.addUser(newUser, (err, user) =>{
    if (err){
      if(err.message == 'User validation failed: email: Error, e-mail already in use'){
        res.json({success: false, msg: 'E-mail exists already'});
      }else{
        res.json({success: false, msg: 'Failed to register user'});
      }
    } else {
      const token = jwt.sign({data: user}, config.secret, {
        expiresIn: 604800 // 1 week
      });
      res.json({
        success: true,
        msg: 'User registered',
        token: 'JWT ' +token,
        user: {
          id: user._id,
          email: user.email
        }
      });
    }
  });
});

// delete a user (with authentication)
router.delete('/delete', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  User.findByIdAndRemove(req.user.id, req.body, function (err, user) {
    if (err) return next(err);
    // delete all the thingys of a user
    user.userThingys.forEach(function(thingy) {
      UserThingy.removeUserThingyByID(thingy, function (err) {
        if (err) return next(err);
      });
    });
    res.json({success: true, msg: 'User & thingys deleted'});
  });
});

// profile of a user (with authentication)
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

// update a user (with authentication)
router.put('/update', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    req.body.userThingys = req.user.userThingys; // makes sure a user can't add thingys manually
    User.findByIdAndUpdate(req.user.id, req.body, {new: true}, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

// authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEMail(email, (err, user) => {
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
            email: user.email,
            name: user.name
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

module.exports = router;
