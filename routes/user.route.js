const express = require('express');
const { model } = require('../db');
const bcrypt = require('bcrypt')
const cors=require("cors")
const { verify } = require('../middleware/authentication');
const { validatoor, update, record } = require('../middleware/validator');
const router = express.Router()
router.use(cors())
router.use(express.json())
router.post('/register', async (req, res) => {
    let data = await model.findOne({ username: req.body.username })
    if (data) {
        res.json("exists")
    } else {
        let password = req.body.password
        let h = bcrypt.hashSync(password, 5)
        req.body.password = h
        let user = new model(req.body)
        await user.save()
        res.json("success")
    }
})
router.post("/login", verify,record, async (req, res) => {
    res.json("matched")
})
router.post("/usercheck", async (req, res) => {
    let u = req.body.username
    let data = await model.find({ username: u })
    if (data.length !== 0) res.json("matched")
    else res.json("notmatched")

})
router.patch("/password",validatoor, async (req, res) => {
    res.json("success")
})
router.get("/", async (req, res) => {
    let data = await model.find()
    res.json(data)
})
router.delete("/delete",async (req, res) => {
    let id=req.body.id
    await model.findByIdAndDelete({_id:id})
    let newdata = await model.find()
    res.json(newdata)
})
router.patch("/updating", update,async (req, res) => {
    let newdata = await model.find()
    res.json(newdata)
})
router.post("/addtodo",async(req,res)=>{
    let username=req.body.username
    let tododata=req.body.tododata
    let data=await model.findOne({username})
    console.log(username);
    data.todo.push(tododata)
    await data.save()
    let newdata = await model.findOneAndUpdate({username},{todo:data.todo})
    res.json(data.todo)

})
router.post("/gettodos",async(req,res)=>{
    let username=req.body.username
    let data=await model.findOne({username})
    if(data==null){
        res.json([])
    }else{
        res.json(data.todo)
    }
})
module.exports={
    router
}