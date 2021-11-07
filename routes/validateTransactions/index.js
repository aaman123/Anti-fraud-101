const router = require('express').Router();
const AWS = require('aws-sdk');
const redis = require('../../config/redisClient');
const authenticateToken = require('../../config/jsonToken').authenticateToken;

const dynamoDocumentClient = new AWS.DynamoDB.DocumentClient();

router.post('/validateTransaction', authenticateToken, async (req, res) => {
    let { transaction_id } = req.body;

    redisCacheAmountExceeded(req, res)
    .then((transAmount) => {
        if(Math.round(transAmount > 1000)) {
            res.json({
                status: 401,
                data: {
                    "transaction_id": transaction_id,
                    "recommendation": "deny"
                },
                message: "Amount exceeded for the user in a given time period."
            })
        } else {
            redisCacheRecentTransactions(req, res)
            .then((recentTransactionsCount) => {
                if(recentTransactionsCount > 3) {
                    res.json({
                        status: 401,
                        data: {
                            "transaction_id": transaction_id,
                            "recommendation": "deny"
                        },
                        message: "User trying too many transactions in a row."
                    })
                } else {
                    dynamoDBCall(req, res)
                    .then((dynamoData) => {
                        if(dynamoData.Count > 0) {
                            res.json({
                                status: 401,
                                data: {
                                    "transaction_id": transaction_id,
                                    "recommendation": "deny"
                                },
                                message: "Transaction has a previous chargeback."
                            })
                        } else {
                            res.json({
                                status: 200,
                                data: {
                                    "transaction_id": transaction_id,
                                    "recommendation": "Approve"
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

const dynamoDBCall = (request, response) => {
    return new Promise((resolve, reject) => {

        let { user_id } = request.body;

        let chargeBackCheckParams = {
            TableName: "transactions_with_chargebacks",
            IndexName: 'userId-index',
            ProjectionExpression: "userId",
            KeyConditionExpression: "#userId = :user_id",
            ExpressionAttributeNames: {
                "#userId": "userId",
            },
            ExpressionAttributeValues: {
                ":user_id": user_id
            }
        }

        dynamoDocumentClient.query(chargeBackCheckParams, (err, data) => { 
            if(err) {
                reject(response.send("Something went wrong"));
            } else {
                resolve(data);
            }
        })
    })
}

const redisCacheRecentTransactions = (req, res) => {
    return new Promise((resolve, reject) => {
        let { user_id } = req.body;
        redis.LRANGE('recentTransactions', 0 , -1, (err, data) => { 
            if(err) {
                reject(res.send("Something went wrong"));
            } else {
                const recentTransactionsCount = data.filter((d) => (JSON.parse(d).userId === user_id)).length;
                resolve(recentTransactionsCount);
            }
        })

    })
}

const redisCacheAmountExceeded = (req, res) => {
    return new Promise((resolve, reject) => {
        let { user_id } = req.body;

        redis.LRANGE(user_id, 0, -1, (err, data) => { 
            if(err) {
                reject(res.send('Something went wrong'));
            } else {
                var totalTransAmount = data.reduce((offset, amt) => Number(JSON.parse(amt).transaction_amount) + offset, 0);
                resolve(totalTransAmount);
            }
        })
    })
}

module.exports = router;