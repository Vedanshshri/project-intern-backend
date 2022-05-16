const AWS = require('aws-sdk');
const util = require("../utils/utils");
const bcrypt = require("bcryptjs");
const cors = require("cors");
AWS.config.update({
    region: "us-east-1"
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "test-table";

async function register(userinfo){
    const name =  userinfo.name;
    const email = userinfo.email;
    const username = userinfo.username;
    const password = userinfo.password;

    if(!name || !username  || !email || !password){
        return util.buildResponse(401,{
            message: "all fields are required"
        })
    }

    const dynamoUser = await getUser(username);
    if(dynamoUser && dynamoUser.username){
        return util.buildResponse(401 ,{
            message: "username already exists in our database"
        })
    }
    const encryptedPass = bcrypt.hashSync(password.trim(),10);

    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPass
    }

    const saveUserResponse = await saveUser(user);
    if(!saveUserResponse){
        return util.buildResponse(503,{
            message: "server error try again later"
        });
    }

    return util.buildResponse(200,{username:username});


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


async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(()=>{
        return true;

    },error=> {
        console.error("there is an error saving user",error);
    });

}

module.exports.register = register;