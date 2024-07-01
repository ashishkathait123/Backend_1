const asyncHandler = (handle)=>{
    (req, res, next)=>{
        Promise.resolve(handle(req, res, next)).catch((error)=>next(error))
    }
}












export{asyncHandler}

// const asyncHandler = (fh)=>async(req, res, next)=>{
//     try{
//         await fh(req, res, next)
//     }
//     catch(error){
//         res.status(error.code|| 500).json({
//             success: true,
//             message: error.message
//         })
//     }
// }