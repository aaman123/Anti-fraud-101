const router = require('express').Router();
const AWS = require('aws-sdk');

const dynamoDocumentClient = new AWS.DynamoDB.DocumentClient();

router.post('/validateTransaction', async (req, res) => {
    // let { user_id, transaction_id, transaction_date, transaction_amount } = req.body;
    let { user_id, transaction_id } = req.body;

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
            }
        }
    })

})

module.exports = router;