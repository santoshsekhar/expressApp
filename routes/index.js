const express = require('express')
const router = express.Router();

const { ensureAuthenticated }= require('../config/auth')

//  main page
router.get('/', (req,res)=> res.render('main'))

router.get('/signIn',(req,res)=> res.render('welcome'))

// Dashboard
router.get('/dashboard', ensureAuthenticated,(req,res)=> 
    res.render('dashboard',{
        name: req.user.name 
    }));

module.exports = router 