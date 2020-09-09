const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const Passport = require('passport');
const userRouter = require('./src/routes');
const connect = require('./config/db');
const configJWTStrategy = require('./src/middleware/passportjwt')


const app = express();

dotenv.config();
connect();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    console.log();
    
    res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, POST, DELETE');
    return res.status(200).json({})
  }
  next();
})

app.use(logger('combined'));
app.use(express.json({ limit: '50mb'}));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(Passport.initialize());
configJWTStrategy();

app.use('/users', userRouter);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
      message: error.message,
  });
});

module.exports = app;
