const mongoose = require('mongoose');
const Chat = require("./models/chat.js")
main()
.then(()=>{
    console.log("connection sucessful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/google');
}

// let allUsers = [
//     {
//         from:"prasad",
//         to:"ramu",
//         msg:"hello how are you",
//         created_at: new Date()
//     },
//     {
//         from:"sahiba",
//         to:"lokesh",
//         msg:"good morning",
//         created_at: new Date()
//     },
//     {
//         from:"arun",
//         to:"kajal",
//         msg:"good afternoon",
//         created_at: new Date()
//     },
//     {
//         from:"ramcharan",
//         to:"pooja",
//         msg:"good evening",
//         created_at: new Date()
//     },
// ]

// Chat.insertMany(allUsers)
// .then((res)=>console.log(res))
// .catch((err)=>console.log(err))