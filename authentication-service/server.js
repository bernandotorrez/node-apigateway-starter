require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const winston = require('winston');
const bearerToken = require('express-bearer-token');
const appRoot = require('app-root-path');
const cors = require('cors');
const compression = require('compression');
const httpStatus = require('http-status');
const globalFunction = require('./utils/globalFunction');
const rateLimit = require('./utils/rateLimiter');

// const jwt = require('jsonwebtoken');

// Middleware
const proxyMiddleware = require('./middleware/proxy');

// setiap membuat file router baru, silahkan panggil disini
const authRouterV1 = require('./routes/v1/authentication');

const app = express();

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bearerToken());
app.use(cors());
app.use([proxyMiddleware]);

// wajib saat naik ke production
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

// Check env JWT_PRIVATE_KEY
if (!process.env.JWT_PRIVATE_KEY) {
  console.error('FATAL ERROR : jwtPrivateKey not set');
  process.exit(1);
}

// setiap ada penambahan Router, inisialisasi index nya disini
app.use('/v1/auth', rateLimit, authRouterV1);

// error handler
process.on('uncaughtException', (ex) => {
  const logDate = globalFunction.timeDate();
  const fileName = `uncaughtException ${logDate}.log`;
  const logLocation = `${appRoot}/logs/${fileName}`;

  const logFile = winston.createLogger({

    transports: [

      new winston.transports.File({
        filename: logLocation,
        level: 'error',
        colorize: true,
        prettyPrint: true
      })
    ]
  });

  logFile.log({
    level: 'error',
    message: `uncaughtException : ${ex.message}`,
    timestamp: globalFunction.logTime()
  });

  console.log(ex);

  process.exit(1);
});

process.on('unhandledRejection', (ex) => {
  const logDate = globalFunction.timeDate();
  const fileName = `unhandledRejection ${logDate}.log`;
  const logLocation = `${appRoot}/logs/${fileName}`;

  const logFile = winston.createLogger({

    transports: [

      new winston.transports.File({
        filename: logLocation,
        level: 'error',
        colorize: true,
        prettyPrint: true
      })
    ]
  });

  logFile.log({
    level: 'error',
    message: `unhandledRejection : ${ex}`,
    timestamp: globalFunction.logTime()
  });

  console.log(ex);

  process.exit(1);
});

app.use(function (req, res, next) {
  res.status(httpStatus.NOT_FOUND).json({
    code: httpStatus.NOT_FOUND,
    success: false,
    message: httpStatus[`${httpStatus.NOT_FOUND}_NAME`],
    data: null
  });
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env').trim() === 'development' ? err : {};

  const logDate = globalFunction.timeDate();
  const fileName = `error ${logDate}.log`;
  const logLocation = `${appRoot}/logs/${fileName}`;

  const logFile = winston.createLogger({

    transports: [
      new winston.transports.File({
        filename: logLocation,
        level: 'error',
        colorize: true,
        prettyPrint: true
      })
    ]
  });

  logFile.log({
    level: 'error',
    message: `${err}`,
    httpStatus: `${err.statusCode || httpStatus.INTERNAL_SERVER_ERROR}`,
    ip: `${req.ip}`,
    url: `${req.originalUrl}`,
    method: `${req.method}`,
    timestamp: globalFunction.logTime()
  });

  // handle bad request
  if (err.statusCode === 400) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      success: false,
      message: 'Bad Request',
      data: JSON.parse(err.message)
    });
  } else {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message || httpStatus[`${httpStatus.INTERNAL_SERVER_ERROR}_NAME`],
      data: null
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log('listening on port ' + process.env.PORT);
});

module.exports = app;
