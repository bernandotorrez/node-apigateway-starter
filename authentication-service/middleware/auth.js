const globalFunction = require('../utils/globalFunction');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = globalFunction.check_null(req.header('X-Auth-Token'));

    if(token == '-') {
        res.status(401).send({
            code: 401,
            status: 'ERROR',
            message: 'token not set',
            data: null,
        });
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            req.user = decoded;
            next();
        } catch(ex) {
            res.status(401).send({
                code: 401,
                status: 'ERROR',
                message: 'token invalid',
                data: null,
            });
        }
    }
}

module.exports = auth;
