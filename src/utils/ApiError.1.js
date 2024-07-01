class ApiError extends Error{
    constructor(
statck="",
message= "something went wong",
error= [],
statusCode,

    ){
        superI(message)
        this.message=message
        this.statusCode=statusCode
        this.data =null
        this.error=error
        this.success= fetch
        if(statck){
            this.stack=statck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export{ApiError}