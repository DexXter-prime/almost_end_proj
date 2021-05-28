const { requiresAuth } = require('express-openid-connect')


exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next()
    } else {
        return res.redirect('/login')
    }
}

exports.checkMainLink = (req, res, next) => {
    if (req.oidc.user === undefined){
        return res.redirect('articles/index')
    } else {
        return res.redirect('articles/index_auth')
    }
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return res.redirect('/')
    }

    next()
}