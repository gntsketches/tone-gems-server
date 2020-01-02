const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// to support putting id token into cookie
passport.serializeUser((user, done) => { // 'user' is user model returned by database
  // user.id is *database* id - NOT the googleId/profile.id
    // user.id is a shortcut; on db side it will look like "_id": { "$old":  etc...
    // using this because user is not necessarily using google for OAuth!
  done(null, user.id);
});

// to support getting user from db based on id token in cookie
passport.deserializeUser((id, done) => {  // id is token we put in cookie (from user.id)
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});


passport.use(
  new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log('accessToken', accessToken); console.log('refreshToken', refreshToken); console.log('profile', profile); console.log('done', done);
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            // first arg error, second is user record
            done(null, existingUser);
          } else {
            new User({ googleId: profile.id })
              .save()
              // database returns user model, which may have had some changes on that side
              .then(user =>  done(null, user));
          }
        })
    })
);
