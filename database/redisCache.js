const fs = require('fs');
const csvParser = require('csv-parse');
const moment = require('moment');
const redis = require('../config/redisClient');

module.exports.seedingIntialRedisCache = () => {

    console.log("Loading intial data into redis cache");

    fs.createReadStream('./sample_files/transactional-sample.csv')
        .pipe(csvParser({delimiter: ','}))
        .on('data', function(transaction_data) {
            // change the date object based on what data you want to cache
            if(new Date(transaction_data[4]) > new Date(moment().subtract(23, 'months').subtract(3, 'days'))) {
                const jsonTransaction =  {
                    "transactionId": transaction_data[0],
                    "userId": transaction_data[2],
                    "merchantId": transaction_data[1],
                    "card_number": transaction_data[3],
                    "transaction_date": transaction_data[4],
                    "transaction_amount": transaction_data[5],
                    "device_id": transaction_data[6],
                    "has_cbk": transaction_data[7]
                }

                //command for setting user_id as key and other data as value in redis cache
                redis.set(transaction_data[2], JSON.stringify(jsonTransaction));             
            }
        })
        .on('end', () => {
            console.log("Finished loading initial data in redis cache");
        })
};
