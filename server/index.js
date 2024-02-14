
const mongoose = require("mongoose");
const Document = require("./Document.js")
require('dotenv').config()
const app = require('express')();
const server = require('http').createServer(app);


app.get('/', function(req, res) {
    res.send("I am running", server, io);
  });

main().catch(err => console.log(err));


const port = process.env.PORT || 3001;

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

const io = require("socket.io")(server, {
  cors: {
    // origin: process.env.REACT_APP_PORT,
    origin: '*',
    methods: ['GET', 'POST']
  }
})

console.log(io);

console.log(port, server)

const defaultValue = ""

io.on("connection" , Socket => {
  Socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    Socket.join(documentId);
    Socket.emit("load-document" , document.data)

 Socket.on("send-changes", delta => {
   Socket.broadcast.to(documentId).emit("receive-changes", delta) 
  })
  Socket.on("save-document" , async data => {
    await Document.findByIdAndUpdate(documentId, { data })
  })
 }) 
})

async function findOrCreateDocument(id) {
  if(id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({_id: id, data: defaultValue})
}

server.listen(port, function() {
    console.log(`Listening on port ${port}`);
  });