const express = require("express");
const app = express();

const port = process.env.PORT || 8000;
app.listen(port);

// set the view engine to ejs
app.set("view engine", "ejs");

// public folder to store assets
app.use(express.static(__dirname + "/public"));

// routes for app
app.get("/", function (req, res) {
  res.render("pad");
});
