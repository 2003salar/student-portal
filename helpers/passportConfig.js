const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Users } = require('../models');
const bcrypt = require('bcrypt');

const authenticateUser = async (email, password, done) => {
    try {
        const user = await Users.findOne({
            where: {
                email,
            }
        });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return done(null, false, {message: 'Incorrect password'});
            }
            return done(null, user);
        } 
        return done(null, false, {message: 'User not found'});
    } catch (error) {
        return done(error)
    }
};

const initialize = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser))
};


passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Users.findByPk(id);
        if (user) {
            return done(null, user.id);
        }
        return done(null, null)
    } catch (error) {
        return done(error)
    }
});

 module.exports = initialize;