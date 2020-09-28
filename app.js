const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);
const db = require('./models/index').sequelize;
const csurf = require('csurf')
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const candidatesRouter = require('./routes/candidates');
const loginRouter = require('./routes/login');

// setup route middlewares
const sequelizeSessionStore = new SessionStore({
  db: db,
});

const sessionOption = {
  secret: 'senator voting secret', // secret key to encrypt the session
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 10, // session duration set to 10min
    httpOnly: true, // true means disable front-end to change the value
    secure: false // only enable cookie when connection is HTTPS, will be disable when HTTP
  }
}


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session


app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession(sessionOption));
app.use(csurf({cookie: false})); // false means store the token in req.session
app.use(helmet());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/candidates', candidatesRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
