const express = require("express");
const app = express();
const sharejs = require("share");
require("redis");

const port = process.env.PORT || 8000;
app.listen(port);

// options for sharejs
var options = {
  db: { type: "redis" },
};

// attach the express server to sharejs
sharejs.server.attach(app, options);

// set the view engine to ejs
app.set("view engine", "ejs");

// public folder to store assets
app.use(express.static(__dirname + "/public"));

// routes for app
app.get("/", function (req, res) {
  res.render("pad");
});

app.get("/(:id)", function (req, res) {
  res.render("pad");
});
