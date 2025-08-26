const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // serve frontend files

let players = {};
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  if (Object.keys(players).length < 2) {
    players[socket.id] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    socket.emit("player-assigned", players[socket.id]);
  } else {
    socket.emit("room-full");
  }

  socket.on("make-move", data => {
    if (board[data.index] === "") {
      board[data.index] = players[socket.id];
      io.emit("update-board", { index: data.index, player: players[socket.id] });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete players[socket.id];
    board = ["", "", "", "", "", "", "", "", ""];
  });
});

server.listen(3002, () => console.log("Server running on http://localhost:3002"));
