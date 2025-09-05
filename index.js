const express = require('express')
const app = express()
const path = require('path');
const Chat = require('./models/chat');
const port = 8090
const mongoose = require('mongoose');
const methodOverride = require("method-override")
const ExpressError = require("./ExpressError")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

main()
    .then(() => {
        console.log("connection sucessful")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/google');
}

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err))
    }
}


// Index Route
app.get("/chats",asyncWrap(async(req, res) => {
    let chats = await Chat.find()
    res.render("index.ejs", { chats })
}))

//Create Chat
app.get("/chats/new", (req, res) => {
    // throw new ExpressError(404,"hello") Error Handling for non async functions
    res.render("new.ejs")
})

app.post("/chats", asyncWrap(async (req, res, next) => {

    let { from, msg, to } = req.body;
    await Chat.create({ from, msg, to });
    res.redirect("/chats");

}));

//Edit route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id)
    if (!chat) {
        // next(new ExpressError(401,"Chat not Found"))
        throw new ExpressError(404, "page not found")
        // next(new ExpressError(504,"chat not found"))
    }
    res.render("edit.ejs", { chat })
}))


app.patch("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let { from, msg, to } = req.body
    await Chat.findByIdAndUpdate(id, { from: from, msg: msg, to: to })
    res.redirect("/chats")

}))

//delete route
app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    await Chat.findByIdAndDelete(id)
    res.redirect("/chats")

}))

app.get("/", (req, res) => {
    res.send("response send")
})


const handleValidationErr = (err)=>{
    console.log("validation error occured")
    return err
}
//Error handling
app.use((err,req,res,next)=>{
    console.log(err.name)
    if(err.name==='ValidationError'){
        err = handleValidationErr(err)
    }
    next(err)
})

app.use((err, req, res, next) => {
    let { status = 500, message="something went wrong" } = err
    res.status(status).send(message)
})



app.listen(port, () => {
    console.log(`server running at port ${port}`)
})

