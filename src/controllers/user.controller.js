import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.1.js";
import {User} from "../models/user.model.js"
import { cloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser= asyncHandler(async(req, res)=>{
// get user details from frontend
//validation - not empty
// check if user already exists : username , email
// check for images, check for avtar
//upload them to cloudnary , avtar
//create user object - create entry in db
//remove password and refresh token field from reponse
//check for user creation
//return response

const {FullName, passowrd,email, usrname}=req.body
if(
[FullName,passowrd,email,usrname].some((field)=>
field?.trim()==="")
){
    throw new ApiError(400, "all fields are required")
}
const exsistedUser= User.findOne({
    $or:[{usrname}, {email}]
})
if(exsistedUser){
    throw new ApiError(409,"User name or email already exist")
}
const avatarLocalPath=  req.files?.avater[0]?.path;
const coverImageLocalPath= req.files?.coverImage[0]?.path;
if(!avatarLocalPath){
    throw new ApiError(400, "Avatar image is required")
}
const avatar= await cloudinary(avatarLocalPath);
const coverImage= await cloudinary(coverImageLocalPath)
if(!avatar){    throw new ApiError(400, "avtar file is required")
}
const user= await User.create({
    FullName,
    avatar: avatar.url,
    converImage:coverImage?.url || "",
    email,
    passowrd,
    usrname:usrname.toLowerCase()
})
   const createdUser= await User.findById(user._id).select("-passowrd -refreshToken")
   if(!createdUser){
    throw new ApiError( 500, "Something went wrong while registering the user")
   }
   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
   )
})
export{registerUser,
}
