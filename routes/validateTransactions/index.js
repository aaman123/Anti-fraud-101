const router = require('express').Router();
const AWS = require('aws-sdk');
const {json} = require('express');
const redis = require('../../config/redisClient');

const dynamoDocumentClient = new AWS.DynamoDB.DocumentClient();

router.post('/validateTransaction', async (req, res) => {
    // let { user_id, transaction_id, transaction_date, transaction_amount } = req.body;
    let { user_id, transaction_id, transaction_date, transaction_amount } = req.body;

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
            console.error(err);
        } else {
            if(data.Count > 0) {
                res.json({
                    status: 401,
                    data: {
                        "transaction_id": transaction_id,
                        "recommendation": "deny"
                    },
                    message: "Transaction has a previous chargeback"
                })
            } else {
                redis.LRANGE('recentTransactions', 0 , -1, (err, data) => {
                    if(err) {
                        console.error(err);
                    } else {
                        const recentTransactionsCount = data.filter((d) => (JSON.parse(d).userId === user_id)).length
                        if (recentTransactionsCount > 3) {
                            res.json({
                                status: 401,
                                data: {
                                    "transaction_id": transaction_id,
                                    "recommendation": "deny"
                                },
                                message: "User trying too many transactions in a row"
                            })          
                        } else {
                            redis.LRANGE(user_id, 0, -1, (err, data) => {
                                if(err) {
                                    console.error(err);
                                } else {
                                    var totalTransAmount = data.reduce((offset, amt) => Number(JSON.parse(amt).transaction_amount) + offset, 0);
                                    if (Math.round(totalTransAmount) > 1000) {
                                        res.json({
                                            status: 401,
                                        data: {
                                            "transaction_id": transaction_id,
                                            "recommendation": "deny"
                                        },
                                        message: "Amount exceeded for the user in a given time period"
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

module.exports = router;