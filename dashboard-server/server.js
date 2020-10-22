const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const ensure = require('connect-ensure-login');

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
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
    console.log('passport local str')
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


const db = require("./app/models");

//db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to api gateway application." });
});

app.post("/auth", 
  passport.authenticate('local'),
  (req, res) => {
  res.json({ message: "Auth to api gateway application." });
});

app.get("/dash", 
  ensure.ensureLoggedIn(),
  (req, res) => {
  res.json({ message: "Dashboard here." });
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
