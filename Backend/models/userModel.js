const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:string,
        required:true,
    },
    email:{
        type:Sring,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    }
},{
  timestamps:true
}
)

module.exports=mongoose.model('User', userSchema)