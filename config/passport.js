const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const keys = require('./keys');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey,
};

module.exports = (passport) => {
  passport.use(
      new JwtStrategy(opts, (jwtPayload, done) => {
        Admin.findById(jwtPayload._id)
            .then((user) => {
              if (user) return done(null, user);
              return done(null, false);
            })
            .catch((err) => done(err, false));
      })
  );
};
