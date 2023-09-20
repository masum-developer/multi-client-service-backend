// const express = require("express");
// const app = express();
// const cors = require("cors")
// require("dotenv").config();
// app.use(cors());
// app.use(express.urlencoded({extended:true}));
// app.use(express.json());

// const PORT = process.env.PORT || 5000;
// const server = app.listen(5000, console.log(`server started on port ${PORT}`));

// const io = require('socket.io')(server,{
//     pingTimeout:60000,
//     cors:{
//         origin:"http://localhost:3000"
//     },
// });

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout:60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log('User connected:', socket.id);
  // Handle chat messages
  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message",data)
  });
  });
  app.use("/",(req,res)=>{
    res.send("Welcome to the server home page");
  })
  server.listen(process.env.PORT || 5000, () => {
    console.log("SERVER IS RUNNING");
  });

  

  




