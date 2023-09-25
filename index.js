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
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const server = http.createServer(app);

  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://mychat:mychat@cluster0.obrngag.mongodb.net/?retryWrites=true&w=majority";
  
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const database = client.db("messagesDB")
      const messageCollection = database.collection("messages");
      app.get('/m',(req,res)=>{
        console.log("data save")
      })

      app.get('/messages', async (req, res) => {
        const result = await messageCollection.find().toArray();
        return res.send(result);
      })

      app.post('/messages',async(req,res)=>{
        
        const message = req.body;
        console.log("new message", message);
        const result = await messageCollection.insertOne(message);
        return res.send(result);
      })
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
     // await client.close();
    }
  }
  run().catch(console.dir);

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
  

app.get("/",(req,res)=>{
  res.send("Welcome to the server home page");
})

  
  server.listen(process.env.PORT || 5000, () => {
    console.log("SERVER IS RUNNING");
  });

  

  




