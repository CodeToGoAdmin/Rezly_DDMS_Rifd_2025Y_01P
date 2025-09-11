export const asyncHandler = (func)=>{

    return async (req,res,next)=>{

try{
      return await func(req,res,next)

      
}catch(error){
      return res.status(500).json ({message:"catch error",error:error.stack});
}
    }
}
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}
