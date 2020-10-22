const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});

module.exports = app => {

    
    app.use(expressSession);

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
    /*User.findById(id, function(err, user) {
        done(err, user);
    });*/
        done(null, { name: 'admin', id: 1 })
    });



    passport.use(new LocalStrategy(
        function(username, password, done) {
            
            if (username == 'admin' && password == 'admin') {
                let user = { name: 'admin', id: 1 }
            return done(null, user);
            } else {
                return done(null, false);
            }
            
            //done('err')


            /*User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
            });*/
        }
    ));
}