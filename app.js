const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');

const { sequelize } = require('./models');
const pageRouter = require('./src/routes/index');
const authRouter = require('./src/routes/auth');
const reqRouter = require('./src/routes/req');

dotenv.config();
const passportConfig = require('./modules/passport');

const app = express();
passportConfig();

sequelize.sync({ force: false }).catch((err) => console.error(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(passport.initialize());

app.use('/', pageRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRouter);
app.use('/req', reqRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'production' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
