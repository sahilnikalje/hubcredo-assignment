const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')

dotenv.config()

const app=express()

const PORT=process.env.PORT

app.use(express.json())
app.use(cors({
    origin:process.env.CLIENT_URL
}))

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected")
})
.catch(err=>{
    console.log("MongoDB connection error", err.message)
})

const authRoutes=require('./routes/auth')
app.use('/api/auth', authRoutes)

app.get('/', (req,res)=>{
    res.send('Backend is nrunning')
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})