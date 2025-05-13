const {Router}=require("express")
const courseRouter=Router();
const {coursemodal,purchasemodal}=require("../db.js")

courseRouter.get("/purchase",(req,res)=>{
    res.json({
        message:"course purchase"
    })
    
})

courseRouter.get("/",(req,res)=>{
    res.json({
        message:"purchase "
    })
})

module.exports={
    courseRouter:courseRouter
}


