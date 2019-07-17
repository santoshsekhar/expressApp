const express = require('express')
const expresslayouts = require('express-ejs-layouts')
const mongoose =  require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport =  require('passport')

const app = express()

// Passport config
require('./config/passport')(passport);

app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/home.html')
})

// Data Base configuration

const db = require('./config/keys').MongoURI

// Connect to Mongo

mongoose.connect(db,{useNewUrlParser:true})
.then(()=> console.log('MongoDB connected'))
.catch(err => console.log(err))

//EJS
app.use(expresslayouts)
app.set('view engine', 'ejs')

// Body parser

app.use(express.urlencoded({ extended:false}));

//  Express session storage
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connecting flash
app.use(flash());

// global variables
app.use((req,res, next)=> {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})

//routes

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))



const PORT = process.env.PORT || 8000


app.listen(PORT,console.log(`server running on http://localhost:${PORT}`))