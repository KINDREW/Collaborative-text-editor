const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const Y = require("yjs");
const RedisPersistence = require("y-redis").default;
const redis = require("redis");

const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);

// Create Redis client
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up RedisPersistence
const persistence = new RedisPersistence(redisClient);

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req, {
    gc: true,
    persistence, // Using the RedisPersistence instance
  });
});

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
