
// require('dotenv').config({path:'./env'})
import { DB_NAME } from "./constants.js";
import express from "express"
import { connectDB } from "./db/index.js";
import { app } from "./app.js";


import dotenv from 'dotenv'
dotenv.config({path:'./env'})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`server listen on ${process.env.PORT}`)
     app.on('error', (error)=>{
        console.log("error:" ,error)
        throw error
     })

     
    })
})
.catch((Error)=>{
    console.log("connection error occur", Error)
})





/*
import express from 'express'
const app = express()
(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("Error", error);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`app is listing at:${process.env.PORT}`)
        })
    }
    catch(error){
        console.error("ERROR" ,error)
        throw error; 
    }
})*/