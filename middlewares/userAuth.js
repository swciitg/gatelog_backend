// ADD JWT MIDDLEWARES
const { NotAuthorizedError } = require("../errors/notAuthorizedError");
// import { config } from "../app";

const axios =  require("axios");
const { RequestValidationError } = require("../errors/requestValidationError");
const { CustomError } = require("../errors/customError");


 exports.verifyUserRequest = async(req,res,next) =>  
{
  try {
    const resp = await axios.get(`https://swc.iitg.ac.in/test/onestop/api/v3/user/`, {
      headers: {
        "authorization": req.headers.authorization,
        "security-key": req.headers["security-key"],
      },
    });
    console.log("done")
    console.log(resp.data)
    if (!resp.data || !resp.data.name || !resp.data.outlookEmail 
      || (resp.data.outlookEmail==="guest@onestop.swc.iitg.ac.in" && req.method!=="GET")){
        next(new NotAuthorizedError("user not authorized"));
      }
    req.currentUser = { id: resp.data._id, email: resp.data.outlookEmail };
  } catch (error) {
    return next(error);
  }
  return next();
}

