const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: '/auth/naver/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('naver profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'naver' },
      });
      if (exUser) {
        done(null, exUser);
      } else {
        const newUser = await User.create({
          email: profile._json?.naver_account?.email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'naver',
        });
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};