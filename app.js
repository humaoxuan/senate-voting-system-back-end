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
const rateLimit = require("express-rate-limit");
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


const csrfRouter = require('./routes/csrf');
const usersRouter = require('./routes/users');
const candidatesRouter = require('./routes/candidates');
const loginRouter = require('./routes/login');
const partyRouter = require('./routes/party');

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
        maxAge: 1000 * 60 * 100, // session duration set to 100min
        httpOnly: true, // true means disable front-end to change the value
        secure: false // only enable cookie when connection is HTTPS, will be disable when HTTP
    }
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const csrfProtection = csurf({cookie: false});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'dist')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(expressSession(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(limiter);
app.use('/api/users', usersRouter);
// app.use()); // false means store the token in req.session


app.use('/api/csrf', csrfRouter);
app.use('/api/login', loginRouter);
app.use('/api/candidates',csrfProtection, candidatesRouter);
app.use('/api/party',csrfProtection, partyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
