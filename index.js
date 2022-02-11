#!/usr/bin/node

const { MongoClient } = require('mongodb');

if(!process.env.MONGO_ROOT_PASSWORD) {
    console.log("This tool needs to have the mongo pass provided as the envvar MONGO_ROOT_PASSWORD");
    return;
}

let cmd = process.argv[2];

if(!cmd) {
    console.log("Commands: add <user eppn>, del <user eppn>, list, list-tokens");
    return;
}

let userEppn = process.argv[3];

switch(cmd) {
    case "add":
        if(!userEppn) {
            console.log("No user eppn provided!");
            return;
        }
        addUser(userEppn);
        break;

    case "del":
        if(!userEppn) {
            console.log("No user eppn provided!");
            return;
        }
        delUser(userEppn);
        break;

    case "list":
        listUsers();
        break;

    case "list-tokens":
        listTokens();
        break;
}

function addUser(userEppn) {
    connectToMongo().then((mongoClient) => {
        let db = mongoClient.db("humlab_speech");
        const usersCollection = db.collection("users");
        usersCollection.insertOne({
            "eppn": userEppn
        }).then((result) => {
            console.log(result);
            mongoClient.close();
        });
    });
}

function delUser(userEppn) {
    connectToMongo().then((mongoClient) => {
        let db = mongoClient.db("humlab_speech");
        const usersCollection = db.collection("users");
        usersCollection.deleteOne({
            "eppn": userEppn
        }).then((result) => {
            console.log(result);
            mongoClient.close();
        });
    });
}

function listUsers() {
    connectToMongo().then((mongoClient) => {
        let db = mongoClient.db("humlab_speech");
        const usersCollection = db.collection("users");
        console.log("Users:");
        usersCollection.find({}).toArray().then((usersList) => {
            usersList.forEach(userObj => {
                console.log(userObj.eppn);
            });

            mongoClient.close();
        });
        
    });
    
}

function listTokens() {
    connectToMongo().then((mongoClient) => {
        let db = mongoClient.db("humlab_speech");
        const tokenCollection = db.collection("personal_access_tokens");
        console.log("Tokens:");
        tokenCollection.find({}).toArray().then((tokenList) => {
            tokenList.forEach(tokenObj => {
                console.log(tokenObj.pat);
            });

            mongoClient.close();
        });

    });

}

async function connectToMongo() {
    const mongoPass = process.env.MONGO_ROOT_PASSWORD;
    const mongodbUrl = 'mongodb://root:'+mongoPass+'@localhost:27017';
    const mongoClient = new MongoClient(mongodbUrl);
    return await mongoClient.connect();
}
