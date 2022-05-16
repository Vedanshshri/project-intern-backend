const jwt = require('jsonwebtoken');

function generateToken(userInfo){
    if(!userInfo){
        return null;
    }

    

    return jwt.sign(userInfo ,process.env.SECRET , {
        expiresIn: "12h"
    })
}

function verifyToken(username,token){
    return jwt.verify(token, process.env.SECRET ,(error , response)=>{
        if(error){
            return {
                verified: false,
                message: "invalid token"
            }
        }

        if(response.username !== username){
            return {
                verified: false,
                message: "invalid user"
            }
        }

        return {
            verified: true,
            message: "verified"
        }
    })
}

module.exports.verifyToken = verifyToken;

module.exports.generateToken = generateToken;