const redisCluster = require('redis-clustr');
const redisClient = require('redis');

/*
    Uncomment if you want to create a redis cluster.
    If using docker create a .sh file that redis configuation and cluster mode enabled
*/
// var redis = new redisCluster({
//     servers: [
//         {
//             host: '127.0.0.1',
//             port: 6379
//         }
//     ],
//     createClient: function (port, host) {
//         return redisClient.createClient(port, host);
//     }
// })

const redis = redisClient.createClient(6379, '127.0.0.1');

redis.on("err", function(err) {
    console.log(err);
})

redis.on("connect", function() {
    console.log("connected");
})

module.exports = redis;