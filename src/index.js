
// require('dotenv').config({path:'./env'})
import { DB_NAME } from "./constants.js";
import express from "express"
import { connectDB } from "./db/index.js";
const app = express()
import dotenv from 'dotenv'
dotenv.config({path:'./env'})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server listin on ${process.env.PORT}`)
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