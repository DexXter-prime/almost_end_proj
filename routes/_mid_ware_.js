exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next()
    } else {
        return res.redirect('/login')
    }
}

exports.checkMainLink = (req, res, next) => {
    if (req.isAuthenticated()){
        return res.redirect('articles/index_auth')
    } else {
        return res.redirect('articles/index')
    }
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return res.redirect('/')
    }

    next()

}