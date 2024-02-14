
const mongoose = require("mongoose");
const Document = require("./Document.js")
require('dotenv').config()

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

const io = require("socket.io")(process.env.SERVER_PORT || 3001, {
  cors: {
    // origin: process.env.REACT_APP_PORT,
    origin: '*',
    methods: ['GET', 'POST']
  }
})

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