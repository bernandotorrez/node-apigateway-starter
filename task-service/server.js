require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const winston = require('winston');
const globalFunction = require('./utils/globalFunction');
const bearerToken = require('express-bearer-token');
const appRoot = require('app-root-path');
const cors = require('cors')
const compression = require('compression');
const httpStatus = require('http-status');

// Middleware
const authMiddleware = require('./middleware/auth');

// const jwt = require('jsonwebtoken');

// setiap membuat file router baru, silahkan panggil disini
const taskRouterV1 = require('./routes/v1/task');

const app = express();

app.use(compression())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bearerToken());
app.use(cors())

// wajib saat naik ke production
if (process.env.NODE_ENV == 'production') {
    app.use(helmet());
}

if (!process.env.JWT_PRIVATE_KEY) {
    console.error(`FATAL ERROR : jwtPrivateKey not set`);
    process.exit(1);
}

// setiap ada penambahan Router, inisialisasi index nya disini
app.use('/v1/task', taskRouterV1);

// error handler
process.on('uncaughtException', (ex) => {
    const log_date = globalFunction.time_date();
    const file_name = `uncaughtException ${log_date}.log`;
    const log_location = `${appRoot}/logs/${file_name}`;

    const logFile = winston.createLogger({

        transports: [

            new winston.transports.File({
                filename: log_location,
                level: 'error',
                colorize: true,
                prettyPrint: true
            })
        ]
    });

    logFile.log({
        level: 'error',
        message: `uncaughtException : ${ex.message}`,
        timestamp: globalFunction.log_time()
    });

    console.log(ex)

    process.exit(1)
})

process.on('unhandledRejection', (ex) => {
    const log_date = globalFunction.time_date();
    const file_name = `unhandledRejection ${log_date}.log`;
    const log_location = `${appRoot}/logs/${file_name}`;

    const logFile = winston.createLogger({

        transports: [

            new winston.transports.File({
                filename: log_location,
                level: 'error',
                colorize: true,
                prettyPrint: true
            })
        ]
    });

    logFile.log({
        level: 'error',
        message: `unhandledRejection : ${ex}`,
        timestamp: globalFunction.log_time()
    });

    console.log(ex)

    process.exit(1)
})

app.use(function (req, res, next) {
    res.status(httpStatus.NOT_FOUND).json({
        code: httpStatus.NOT_FOUND,
        status: 'ERROR',
        message: httpStatus[`${httpStatus.NOT_FOUND}_NAME`],
        data: null
    });
});


app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env').trim() == 'development' ? err : {};

    const log_date = globalFunction.time_date();
    const file_name = `error ${log_date}.log`;
    const log_location = `${appRoot}/logs/${file_name}`;

    const logFile = winston.createLogger({

        transports: [

            new winston.transports.File({
                filename: log_location,
                level: 'error',
                colorize: true,
                prettyPrint: true
            })
        ]
    });

    // uncomment when use JWT
    // const decoded = jwt.verify(req.header('X-Auth-Token'), process.env.JWT_PRIVATE_KEY);
    
    logFile.log({
        level: 'error',
        message: `${err}`,
        httpStatus: `${err.statusCode || httpStatus.INTERNAL_SERVER_ERROR}`,
        ip: `${req.ip}`,
        url: `${req.originalUrl}`,
        method: `${req.method}`,
        // email: `${decoded._email}`,
        timestamp: globalFunction.log_time()
    });
    
    // render the error page
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        status: 'ERROR',
        message: err.message || httpStatus[`${httpStatus.INTERNAL_SERVER_ERROR}_NAME`],
        data: null
    });
});

app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
})

module.exports = app;