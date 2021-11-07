const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports.createJsonToken = () => {
    return jwt.sign({key: 'cloudwalk-merchat'}, process.env.token_secret, { expiresIn: '1800s'});
}

module.exports.authenticateToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if(!token) {
        res.status(403).send("Please provide a authorization token");
    } else {
        jwt.verify(token, process.env.token_secret, (err, data) => {
            if (err) {
                res.status(401).send('User is not authorized');
            } else {
                next();
            }
        })
    }
}