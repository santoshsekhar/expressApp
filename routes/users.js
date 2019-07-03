const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')


// User model
const User = require('../models/User')



//Login 
router.get('/login', (req,res)=> res.render('login'))

//sign up 
router.get('/signup', (req,res)=> res.render('signup'))

// Sign up handler
router.post('/signup', (req,res)=> {
     const { name, email, password, password2}= req.body
     let errors = []

     //validation
     if(!name || !password ||!password2){
         errors.push({msg:"Fill all fields required"})
     }
    //  password match??
    if(password!= password2){
        errors.push({msg:"Passwords do not match!!!"})
    }
    // password length
    if(password.length < 6){
        errors.push({msg:"Passwords cannot be less than 6 characters"})
    }
    
    if(errors.length >0){
        res.render('signup',{
            errors,
            name,email,password,password2
        })
    }
    else{
        // Validation pass
        User.findOne({email:email})
        .then(user => {
            if(user){
                // User exists
                errors.push({msg: 'user already registered'});
                res.render('signup',{
                    errors,
                    name,email,password,password2
                });
            }
            else{
                const newUser = new User({
                    name,email,password
                });
                // hash passcode
                bcrypt.genSalt(10, (err,salt)=> 
                bcrypt.hash(newUser.password,salt,(err,hash) =>{
                if(err) throw err;
                     // setting password to hash
                newUser.password = hash
                //  save user
                newUser.save()
                .then(user => {
                    req.flash('success_msg', 'User registered - Log in')
                    res.redirect('/users/login');
                })
                .catch(err => console.log(err));

                }))
            }
        });

    }

});

//  Login handler
router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req,res, next);


})

//  Logout Handler
router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success_msg','User logged out')
    res.redirect('/users/login')

})

module.exports = router