const cors = require("cors");
f

function buildResponse(statusCode,body){
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':   "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            'Content-Type' : 'application/json'
        },
        body: body
    }
}

module.exports.buildResponse= buildResponse;