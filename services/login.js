const AWS = require('aws-sdk');
const util = require("../utils/utils");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");
const cors = require("cors");

AWS.config.update({
    region: "us-east-1"
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "test-table";

async function login(user){
    const username = user.username;
    const password = user.password;
    if(!user || !username || !password){
        return util.buildResponse(401, {
            message: "username and password required"
        })
    }

    const dynamoUser = await getUser(username.toLowerCase().trim());

    if(!dynamoUser || !dynamoUser.username ){
        return util.buildResponse(403,{
            message: "user does not exists"
        })
    }

    if(!bcrypt.compareSync(password , dynamoUser.password)){
        return util.buildResponse(403,{
            message: "password is incorrect"
        })
    }

    const userInfo ={
        username: dynamoUser.username,
        name: dynamoUser.name
    }

    const token = auth.generateToken(userInfo);
    const response = {
        user: userInfo,
        token:token
    }
    
    return util.buildResponse(200,response);
}

async function getUser(username){
    const params = {
        TableName: userTable,
        Key: {
            username:username
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    },error => {
        console.error("there is an error ",error);
    });
    
}

module.exports.login = login;