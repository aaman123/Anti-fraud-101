const { urlencoded, json} = require('express');
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const AWS = require('aws-sdk');
AWS.config.update({
    "region": "ap-south-1",
    "accessKeyId": `${process.env.aws_access_key_id}`,
    "secretAccessKey": `${process.env.aws_secret_access_key}`
})

const dynamoDB = require('./database/dynamoDB');
const app = express();
const port = process.env.PORT || 8080;

app.use(json());
app.use(urlencoded({extended: true}));
app.use("/api", require('./routes/validateTransactions'));
app.set(port);

/*
    Uncomment to create tables and load data into the database
*/
// dynamoDB.dynamoCreateTable();
// dynamoDB.dynamoCreateTableWithChargeBacks();
// dynamoDB.dynamoLoadData();

const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);
server.on('error', onError);

function onListening() {
    console.log('Server is listening on ', port);
}

function onError() {
    console.log('An unexpected error occured');
}
