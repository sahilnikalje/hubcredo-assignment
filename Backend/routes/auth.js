const express=require('express')
const User=require('../models/userModel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const authMiddleware=require('../middleware/authMiddleware')

const router=express.Router()

function isValidEmail(email){
    return /\S+@\S+\.\S+/.test(email)
}

//register
router.post('/signup', async (req,res)=>{
    try{
        const{name,email,password}=req.body

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        if(!isValidEmail(email)){
            return res.status(400).json({message:"Invalid email"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"})
        }

        const existing=await User.findOne({email})
        if(existing){
            return res.status(400).json({message:"User already exists with this email"})
        }

        const salt=await bcrypt.genSalt(10)
        const hashed=await bcrypt.hash(password, salt)

        const user=new User({name,email, password:hashed})
        await user.save()

        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )

        res.status(201).json({
            message:'User created',
            token,
            user:{id:user._id, name:user.name, email:user.email}
        })
    }
    catch(err){
          console.error(err)

          if(err.code===11000){
            return res.status(400).json({message:"User already exists with same email"})
          }
          res.status(500).json({message:"Server error"})
       }
})

//login
router.post('/login', async (req,res)=>{
    try{
        const {email, password}=req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )

        res.json({
            message:"Login successfull",
            token,
            user:{id:user._id, name:user.name, email:user.email}
        })
    }
    catch(err){
        console.error(err)
        res.status(500).json({message:"Server error"})
    }
})

//get profile
router.get('/profile', authMiddleware, async(req,res)=>{
    try{
       const user=await User.findById(req.userId).select('-password')
       if(!user) return res.status(404).json({message:"User not found"})
        
        res.json({user})
    }
    catch(err){
        console.error(err)
        res.status(500).json({message:"Server error"})
    }
})


module.exports=router