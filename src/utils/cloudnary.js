import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs";
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View Credentials' below to copy your API secret
}); 

const uploadonCloudnary =  async (localFilePath) =>{
try{
    if(!localFilePath) return null
    //upload the file on coloudnary
    const reponse= await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
    })
    //file has been uploade successfully
    console.log("file is uploaded on cloudnary", response.url)
   return reponse ;
}
catch(error){
fs.unlinkSynca(localFilePath) //remove the locally saved temporary file as the upload operation got failed
return null;
}
}
export{cloudinary};
