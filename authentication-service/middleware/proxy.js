function auth(req, res, next) {
    const validApiGatewayIP = ['::ffff:127.0.0.1'];
    const remoteAddress = req.connection.remoteAddress;
    console.log(remoteAddress);

    if(validApiGatewayIP.includes(remoteAddress)) {
        next();
    } else {
        res.status(403).send({
            code: 403,
            status: 'ERROR',
            message: 'Please HIT with API Gateway',
            data: null,
        });
    }
}

module.exports = auth;