const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: err });
}


const app = express();
app.disable('x-powered-by');
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({type: "*/*"}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsonErrorHandler)

require("./app/passport-setup")(app);



const db = require("./app/models");

//db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route

require("./app/routes/routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
