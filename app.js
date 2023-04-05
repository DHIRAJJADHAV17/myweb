require('dotenv').config();

const bodyparser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.SECRET)

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true}).then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

const userschema = new mongoose.Schema( {
    email: String,
    password: String
});



userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userschema);


app.get("/",function(req,res){
    res.render("home")
});

app.get("/register",function(req,res){
    res.render("register")
});

app.get("/login",function(req,res){
    res.render("login")
});




app.post("/register",function(req,res){
const newUserDoc= async ()=>{
    try{
        const newuser= new User({
            email:req.body.username,
            password:req.body.password
        });
       const val= await newuser.save();
      const renrc= await res.render("secrets");
    
    }catch(err){
        console.log(err);
    }

}
newUserDoc();

});

app.post("/login",async function(req,res){
    const valid =  await User.findOne({email:req.body.username});
    try
    {
        if(valid.password===req.body.password){
            res.render("secrets")
        }else{
            res.send('incorrect');
        }

    }catch(err)
    {
        console.log(err);
    }



});



// .than(function(){
//     console.log("no err");
//     res.render("secrets");

// }).catch(function(err){

//     console.log(err);

// })



app.listen(3000,function(){
    console.log("Server Stared");
});

