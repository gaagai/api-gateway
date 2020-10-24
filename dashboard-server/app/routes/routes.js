const auth = require('../middleware/auth');
const passport = require('passport');

module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();
  
  router.get("/", (req, res) => {
    res.json({ message: "Welcome to api gateway application." });
  });
  
  /*router.post("/auth", 
    passport.authenticate('local', { failWithError: true }),
    (req, res) => {
      res.json({ message: "Auth to api gateway application." });
  });*/
  router.post('/auth', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(403).json({'error': 'Authenticaiton failed. Please check if your credentials are valid.'}); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.status(200).json({'success': true, user});
      });
    })(req, res, next);
  });

  router.post('/logout', auth, function(req, res){
    req.logout();
    res.status(200).json({success: true});
  });
  
  router.get("/dash", 
    auth,
    (req, res) => {
    res.json({ message: "Dashboard here.", data: { 
      graph: [1,2,3]
    } });
  });



  let routerTutorials = require("express").Router();

  // Create a new Tutorial
  routerTutorials.post("/", tutorials.create);

  // Retrieve all Tutorials
  routerTutorials.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  routerTutorials.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  routerTutorials.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  routerTutorials.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  routerTutorials.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  routerTutorials.delete("/", tutorials.deleteAll);

  app.use('/api/tutorials', routerTutorials);
  app.use('/', router);

  app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
    return;
  })

};
