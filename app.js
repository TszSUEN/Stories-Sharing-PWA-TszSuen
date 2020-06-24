// load the .env file first if required specific setup
// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').parse()
// }

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const passport = require('passport')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')

// session setup
const session = require('express-session')({
    cookie: { maxAge: 60000 },
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});



// const routers setup
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const logoutRouter = require('./routes/logout');
const profileRouter = require('./routes/profile');
const recommendationRouter = require('./routes/recommendation');
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const storyRouter = require('./routes/stories')



// view engine setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(passport.initialize())
app.use(passport.session())
app.use(session);



// Models setup
const UserModel = require('./models/users');

// MongoDB setup here
const mongoose = require('mongoose')
const URI = "mongodb+srv://COM3504:COM3504@cluster0-hmghw.mongodb.net/user?retryWrites=true&w=majority";
mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
const mongoDB = mongoose.connection
mongoDB.on('error', error => console.error(error))
mongoDB.once('open', () => console.log('Successfully Connected to Cloud Mongoose!'))



app.use('/', indexRouter)
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);
app.use('/recommendation', recommendationRouter);
app.use('/users', userRouter)
app.use('/stories', storyRouter)



/* PASSPORT LOCAL AUTHENTICATION */
app.get('/', function (req, res, next) {
    return res.redirect('/login');
});

// for login
app.get('/login', function (req, res, next) {
    res.render('login.ejs')
});
app.post('/login', function (req, res, next) {
    var FindUser = mongoose.model('FindUser', UserModel.schema, 'users');

    FindUser.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if(err) return next(err);
        if(!user) return res.send('Not logged in!');

        req.session.user = req.body.email;
        return res.redirect('/profile');
    });
});

// for registration
app.get('/register', function (req, res, next) {
    res.render('register.ejs')
})
app.post('/register', function (req, res, next) {
    var user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };
    var userRegister = mongoose.model('userRegister', UserModel.schema, 'users');
    userRegister.create(user, function(err, user) {
        if(err) return next(err);
        req.session.user = req.body.email;
        return res.redirect('/login');
    });
});


// get local session user info
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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



// set the port here
app.listen(process.env.PORT || 3000)