const express = require("express");
const sharejs = require("share");
const redis = require("redis"); // Assuming Redis is required
const app = express();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Options for ShareJS
const options = {
  db: { type: "redis" },
};

// Attach the Express server to ShareJS
sharejs.server.attach(app, options);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Public folder to store assets
app.use(express.static(`${__dirname}/public`));

// Routes for the app
app.get("/", (req, res) => {
  res.render("pad");
});

app.get("/:id", (req, res) => {
  res.render("pad");
});
