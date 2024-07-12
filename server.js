require("dotenv").config();

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");
const Y = require("yjs");
const redis = require("redis");

const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);

// Create Redis client using environment variables
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req, {
    gc: true,
    redisClient, // Pass the Redis client to the setupWSConnection function
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
