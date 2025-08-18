const express = require('express')
const app = express()
const path = require('path');
const Chat = require('./models/chat');
const port = 8090
const mongoose = require('mongoose');
const methodOverride = require("method-override")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

main()
.then(()=>{
    console.log("connection sucessful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/google');
}


// Index Route
app.get("/chats",async (req,res)=>{
    let chats = await Chat.find()
    res.render("index.ejs",{chats})
})

//Create Chat
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs")
})

app.post("/chats",(req,res)=>{
    let {from,msg,to} = req.body;
    console.log(req.body)
    Chat.insertOne({"from":from,"msg":msg,"to":to})
    .then((result)=>{
        res.redirect("/chats")
    })
    .catch((err)=>{
        console.log(err)
        res.send("error")
    })
})

//Edit
app.get("/chats/:id",async(req,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id)
    res.render("edit.ejs",{chat})
})


app.patch("/chats/:id",async(req,res)=>{
    let {id} = req.params;
    let {from,msg,to} = req.body
    await Chat.findByIdAndUpdate(id,{from:from,msg:msg,to:to})
    res.redirect("/chats")
})

//delete
app.delete("/chats/:id",async(req,res)=>{
    let {id} = req.params;
    await Chat.findByIdAndDelete(id)
    res.redirect("/chats")
})

app.get("/",(req,res)=>{
    res.send("response send")
})

app.listen(port,()=>{
    console.log(`server running at port ${port}`)
})

