import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";

import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";

import cors from "cors";
import auth from "./controllers/auth.controller.js";
import chessGames from "./controllers/chessGames.controller.js";

import "./database.js";
import model from "./model.js";

const port = 8989;
const app = express(); // Create express app.
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConf = expressSession({
  secret: "Super secret! Shh! Do not tell anyone...",
  resave: true,
  saveUninitialized: true,
});

app.use(sessionConf);
io.use(
  socketIOSession(sessionConf, {
    autoSave: true,
    saveUninitialized: true,
  })
);

// Controllers
// app.use('/api/me', auth.requireAuth, auth.router)
app.use("/api", auth.router);

app.use("/api", chessGames.router);

model.init(io);

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
