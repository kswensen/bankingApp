require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    massive = require('massive'),
    session = require('express-session');

const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

massive(process.env.CONNECTIONSTRING).then(db => {
    app.set('db', db);
});

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        const db = app.get('db');
        db.find_user(profile.id).then(user => {
            if(user[0]){
                return done(null, user);
            } else {
                db.create_user([profile.displayName, profile.emails[0].value, profile.picture, profile.id]).then(user => {
                    return done(null, user[0]);
                });
            }
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    app.get('db').find_session_user(user[0].id).then(user => {
        return done(null, user[0]);
    });
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3001/#/private', 
    failureRedirect: 'http://localhost:3001/#/'
}))

const port = 3010;
app.listen(port, console.log(`It's lit on ${port} fam!`));