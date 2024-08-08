import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.1.js";
export const verifyJwt= asyncHandler(async(req, _, next)=>{
   try {
     const token = req.cookies?.accessToken || req.header
 ("Authorization")?.replace("Bearer " ,"")
 console.log("Token:", token);
 if (!token) {
     throw new ApiError( 401, " Unauthorized request")
     
 }
 const decodeToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 const user= await User.findById(decodeToken?._id).select("-password -refreshToken")
 if (!user) {
     throw new ApiError (405, " Invalid Access token")
 }
 req.user= user;
 next()
   } catch (error) {
    throw new ApiError( console.log(error ,'invalid access token') , error?.message || "Invalid access token")
   }
  
})
 
