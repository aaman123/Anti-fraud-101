const AWS = require('aws-sdk');
const fs = require('fs');
const csvParser = require('csv-parse');

let dynamo = new AWS.DynamoDB();
let dynamoDocumentClient = new AWS.DynamoDB.DocumentClient();

module.exports.dynamoCreateTable = () => {

    var params = {
        TableName: "transactions",
        KeySchema: [
            { AttributeName: "transactionId", KeyType: "HASH"},
            { AttributeName: "userId", KeyType: "RANGE"},
        ],
        AttributeDefinitions: [
            { AttributeName: "transactionId", AttributeType: "S" },
            { AttributeName: "userId", AttributeType: "S" },
    
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    }

    dynamo.createTable(params, (err, data) => {
    if(err) {
        console.error("Something went wrong", err);
    } else {
        console.log("Table created", data);
        }
    })
}

module.exports.dynamoCreateTableWithChargeBacks = () => {
    var params = {
        TableName: "transactions_with_chargebacks",
        KeySchema: [
            { AttributeName: "transactionId", KeyType: "HASH"},
            { AttributeName: "userId", KeyType: "RANGE"},
        ],
        AttributeDefinitions: [
            { AttributeName: "transactionId", AttributeType: "S" },
            { AttributeName: "userId", AttributeType: "S" },
    
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    }

    dynamo.createTable(params, (err, data) => {
    if(err) {
        console.error("Something went wrong", err);
    } else {
        console.log("Table created", data);
        }
    })
}

module.exports.dynamoLoadData = () => {
    fs.createReadStream('./sample_files/transactional-sample.csv')
        .pipe(csvParser({delimiter: ','}))
        .on('data', function(transaction_data) {
            console.log("Loading data in DynamoDB");
            if(transaction_data[7] === "TRUE") {
                var params = {
                    TableName: "transactions_with_chargebacks",
                    Item: {
                        "transactionId": transaction_data[0],
                        "userId": transaction_data[2],
                        "merchantId": transaction_data[1],
                        "card_number": transaction_data[3],
                        "transaction_date": transaction_data[4],
                        "transaction_amount": transaction_data[5],
                        "device_id": transaction_data[6],
                        "has_cbk": transaction_data[7]
                    }    
                }
                
                dynamoDocumentClient.put(params, (err, data) => {
                    if(err) {
                        console.error(err);
                    } 
                })
                
            } else {    
                var params = {
                    TableName: "transactions",
                    Item: {
                        "transactionId": transaction_data[0],
                        "userId": transaction_data[2],
                        "merchantId": transaction_data[1],
                        "card_number": transaction_data[3],
                        "transaction_date": transaction_data[4],
                        "transaction_amount": transaction_data[5],
                        "device_id": transaction_data[6],
                        "has_cbk": transaction_data[7]
                    }    
                }
                
                dynamoDocumentClient.put(params, (err, data) => {
                    if(err) {
                        console.error(err);
                    } 
            })
        }          
    })
    .on("end", () => {
        console.log("Completed loading data in dynamoDB");
    })
}


