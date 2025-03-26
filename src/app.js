import "dotenv/config";
import express from "express";

const app = express();

// Define a route for the root URL
app.get('/api', (req, res) => {
  res.send('Welcome to the homepage!');
});

// parse json of incoming request body
app.use(express.json({ limit: "17kb" }));

// configure urlencoded data
app.use(express.urlencoded({ limit: "17kb", extended: true }));

export default app;
