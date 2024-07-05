class ApiError extends Error{
    constructor(
stack="",
message= "something went wong",
error= [],
statusCode,

    ){
        super(message)
        this.message=message
        this.statusCode=statusCode
        this.data =null
        this.error=error
        this.success= fetch
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export{ApiError}