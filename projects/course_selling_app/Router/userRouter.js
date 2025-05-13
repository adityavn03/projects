const {Router, application}=require("express")
const express=require("express")
const bcrypt=require("bcrypt")
const {z}=require("zod")
const userRouter=Router();
const {user_auth}=require("../middleware/user_middlesware.js")
const {jwt_user_secret}=require("../config")
const {usermodal,purchasemodal, coursemodal}=require("../db.js")
const jwt=require("jsonwebtoken")
const app=express()
app.use(express.json())



userRouter.post("/signup",async(req,res)=>{
    const email=req.body.email;
    const pass=req.body.password;
    const password=await bcrypt.hash(pass,5)
    const firstname=req.body.firstname;
    const lastname=req.body.lastname;
    const verify=await usermodal.findOne({email:email})
    const verification=z.object({
            email:z.string().email(),
            password:z.string(),
            firstname:z.string(),
            lastname:z.string()
    
        })
        const {success,error}=verification.safeParse({email,password,firstname,lastname})
        if(!success){
            res.json({
                message:"fill correctly",
                error
            })
            return
        }
    const hashedpassword=await bcrypt.hash(password,5)
    
     
    if(!verify){
        await usermodal.create({
        email:email,
        password:hashedpassword,
        firstname:firstname,
        lastname:lastname,


    })

    res.json({
        message:"signup"
    })
}

})

userRouter.post("/signin",async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const verify=await usermodal.findOne({email:email})
    const verifyedpassword=bcrypt.compare(password,verify.password)
    if(verifyedpassword){
        const token=jwt.sign({id:verify._id.toString(),email},jwt_user_secret);
        res.json({
        message:"signin",
        token
        })
        console.log(token);
    }
    else{
        res.json({
            message:"signin failed"
        })
    }


    
    
})

userRouter.get("/purchase",user_auth ,async(req,res)=>{
    const user_id=req.id;
    const course_id=req.body.course_id;
    console.log(course_id)
    const insert_purchase=await purchasemodal.create({
        courseId:course_id,
        userId:user_id
    })


    res.json({
        message:"purchaase successfull",
        insert_purchase
    })

})

userRouter.post("/course",user_auth ,async(req,res)=>{
    const admin_id=req.id;
    const courseId=req.courseId;
    const user_course=await coursemodal.find({
        courseId:courseId,
        userId:admin_id
        
    })
    res.json({
        message:"course have successfully created ",
        user_course
    })
})




module.exports={
    userRouter:userRouter
}