const passport = require('passport');
const GoogleStrategy = require('passport-google').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.Google_ID,
    callbackURL: '/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('google profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'google' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: profile._json?.naver_account?.email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'google',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};