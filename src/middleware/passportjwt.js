const Passport = require('passport');
const PassportJWT = require('passport-jwt');
const User = require('../model/user.model');

const configJWTStrategy = () => {
    const opts = {
        jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.secret
    };
    Passport.use(new PassportJWT.Strategy(opts, (payload, done) => {
        User.findOne({ _id: payload.id }, (err, user) => {
            if (err) {
                return done(err);
            }
            
            if (user) {
                return done(null, user)
            }
            
            return done(null, false)
        });
    }))
}

module.exports = configJWTStrategy;