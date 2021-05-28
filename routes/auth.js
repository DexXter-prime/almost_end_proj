const express = require('express')
const router = express.Router()
const User = require('../models/user_model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const {checkAuthenticated, checkNotAuthenticated} = require('./_mid_ware_')



router.get('/login',  checkNotAuthenticated, (req, res) => {
    res.render('login')
})


router.post('/login', checkNotAuthenticated,  passport.authenticate('local', {
    successRedirect: '/articles',
    failureRedirect: '/login',
    failureFlash: true
}))


router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
})


router.post('/register', checkNotAuthenticated, async (req, res) => {
    let curUser = req.curUser
    curUser = new User()
    let hashedPass = await bcrypt.hash(req.body.password, 10)
    curUser.login = req.body.logname
    curUser.email = req.body.email
    curUser.password = hashedPass

    curUser = await curUser.save()
    res.redirect('/login')
})


router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})


module.exports = router

