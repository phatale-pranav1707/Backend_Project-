class ApiError extends Error{
    constructor(
         StatusCode,
         message="something went wrong",
         errors=[]
    ){
        super(message),
        this.StatusCode=StatusCode,
        this.data=null,
        this.message=message,
        this.errors=errors,
        this.success=false

    }
}

export {ApiError};