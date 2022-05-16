const util =require("../utils/utils");
const auth = require("../utils/auth");

function verify(requestBody){
    if(!requestBody.user.username || !requestBody.user || !requestBody.token){
        return util.buildResponse(401,{
            varified: false,
            message: "incorrect request body"
        })
    }

    const user = requestBody.user;
    const token = requestBody.token;
    const varification = auth.verifyToken(user.username , token);

    if(!varification.varified){
        return util.buildResponse(401,varification);
    }

    return util.buildResponse(200 , {
        varified:true,
        message:"success",
        token: token,
        user:user
    })

}

module.exports.verify =verify;