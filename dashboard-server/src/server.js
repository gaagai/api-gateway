const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: err });
}


const app = express();
app.disable('x-powered-by');
var corsOptions = {
  //origin: "*"
  origin: true,
  credentials: true
};

app.use(cors(corsOptions));
//app.options('*', cors());

// parse requests of content-type - application/json
app.use(bodyParser.json({type: "*/*"}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsonErrorHandler)

require("./passport-setup")(app);


const { initDb } = require('./services/clickhouse');

// init clickhouse
let cdb1 = initDb(require("./config/db.config").CLICKHOUSE);

// init mysql
const db = require("./models");

//db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route

require("./routes/routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});