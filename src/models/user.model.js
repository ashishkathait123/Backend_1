import mongoose ,{Schema, modelNames} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
username:{
    type: String,
required: true,
lowercase:true,
unique: true,
trim:true,
index:true
},
email:{
    type: String,
required: true,
lowercase:true,
unique: true,
trim:true,

},
fullname:{
    type: String,
required: true,
trim:true,
index:true
},
avtar:{
    type: String,
    required:true
},
coverImage:{
    type: String
},

watchHistory:{
    type: Schema.Types.ObjectId,
    ref:"Video"
},
refreshToken:{
    type: String
},
password:{
    type: String,
    required: [true, "password is required"]
}



},{timestamps:true})
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next ();

    this.password =await bcrypt.hash(this.password, 10)
   next()
}) 
userSchema.method.isPasswordCorrect = async function (password){
       await bcrypt.compare(password, this.password) //Chcek the password
    }
    userSchema.method.generateAccessToken =async function (){
        jwt.sign({
            _id:this._id,
            email:this.email,
        username:this.username,
        fullname: this.fullname
        }, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    }
    userSchema.method.generateRefreshToken =async function (){
        jwt.sign({
            _id:this._id,
           
        }, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    }
export const User = mongoose.model('User', userSchema)