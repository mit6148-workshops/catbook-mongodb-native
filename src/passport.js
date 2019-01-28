const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const mongo = require('./db2');

// set up passport configs
passport.use(new GoogleStrategy({
  clientID: '802188459296-h1gska49bie30n68mti8d07tosc5rc7d.apps.googleusercontent.com',
  clientSecret: 'h7n4UrnZk18vLKjBH6uzPn0u',
  callbackURL: '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  const users = mongo.getDb().collection('users');
  users.findOne({googleid: profile.id})
    .then(user => {
      if (user) return user;
      
      // if user doesn't exist, make a new mongo document
      return users.insertOne({
        name: profile.displayName,
        googleid: profile.id
      });
    })
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err));
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
