const express = require("express");

const db = require("./db/connection");

const users = require("./routes/users");
const notes = require("./routes/notes");

const authenticateToken = require("./middleware/auth");

const app = express();

app.use(express.json());

app.use("/api/auth", users(db));
app.use("/api", authenticateToken, notes(db));

module.exports = app;