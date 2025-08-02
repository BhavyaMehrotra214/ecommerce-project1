const express = require("express");
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register");
});


router.post("/register",async(req,res)=>{
    const {username, email, password} = req.body

  const hasedpass =   await bcrypt.hash(password,10)
  console.log(password)
  console.log(hasedpass)
     
    const user = await userModel.create({
        username : username,
        email : email,
        password : hasedpass,
    })
    res.redirect("/users/login")

})


router.get("/login", (req, res)=>{
    res.render("login")
})


router.post("/login",async(req,res)=>{
    const {email, password} = req.body

    const user = await userModel.findOne({
        email : email,
    })
     console.log(user);
    if(!user){
        return res.redirect("/users/register")
    }


    const match = await bcrypt.compare(password, user.password)

    if(!match){
        return res.redirect("/users/login")
    }
     const token = jwt.sign({ id: user._id, username: user.username }, "hffffsyuthwakn");
     res.cookie("token", token)
     res.redirect("/")
})

router.get("/logout", (req, res)=>{
    res.clearCookie("token")
    res.redirect("/users/login")
})

module.exports = router;
