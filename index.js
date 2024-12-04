const express = require('express');
const app = express();
const session = require('express-session');
const initializePassport = require('./helpers/passportConfig');
const passport = require('passport');
const PgSimple = require('connect-pg-simple')(session);
initializePassport(passport);
require('dotenv').config();


const sessionStore = new PgSimple({
    conString: process.env.DB_STRING,
    tableName: 'session'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.all("*", (req, res) => res.status(404).json({message: "Page not Found"}));

app.listen(3000, ()=> {
    console.log('Server listening on port 3000');
});

module.exports = passport;