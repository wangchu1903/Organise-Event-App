
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express();
const path = require('path')

const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');

const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');

const eventRoutes = require('./routes/events.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');

const User = require('./models/user');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL;


mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("mongo connection open!!")

    })
    .catch((err) => {
        console.log("oh no mongo connection error!!")
        console.log(err)
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeasecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret: 'nothingsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/events', eventRoutes);
app.use('/events/:id/reviews', reviewRoutes);
app.use('/', userRoutes);



app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh no error something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Listening to port 3000")
})


