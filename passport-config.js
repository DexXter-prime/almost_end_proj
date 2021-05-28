const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user_model')


function initializePassport(passport) {
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {

        const currentUser = await User.findOne({email: email})

        
        if (currentUser == null){
            return done(null, false, {msg: 'Такого Email не существует'})
        }
        try {
            if (await bcrypt.compare(password, currentUser.password)){
                return done(null, currentUser)
            } else {
                return done(null, false, {msg: 'There is no such user'})
            }
        } catch (e) {
            return done(e)
        }
    }))

    passport.serializeUser((currentUser, done) => done(null, currentUser._id))
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}   


module.exports = initializePassport