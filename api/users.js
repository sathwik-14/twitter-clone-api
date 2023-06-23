const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:String,
  email:String,
  password:String,
  bio:String,
  joinDate:{
    type:Date,
    default:Date.now
  },
  profilePicture:{
    data: Buffer,
    contentType: String
},
  is_verified:{
    type:Boolean,
    default:false
  }
})


module.exports=mongoose.model("Users",userSchema)

