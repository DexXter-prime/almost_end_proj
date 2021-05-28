const express = require('express')
const router = express.Router()
const Article = require('./../models/article')


router.get('/', (req, res) => {
    if (req.oidc.user === undefined) {
        res.render('articles/index')
    }
    else {
        res.render('articles/index_auth', { user: req.oidc.user.email })
    }
})

//dddd

router.post('/lib', (req, res) => {
    let teach = req.body.teacher
    let stat = req.body.status
    if (stat == 'undefined' || stat == null) {
        stat = 100;
    }
    let name = req.body.name
    res.redirect(`/articles/lib?teacher=${teach}&stat=${stat}&name=${name}`)
})

router.post('/lib_name', (req, res) => {
    let name = req.body.proj_name.toLowerCase()
    res.redirect(`/articles/lib?name=${name}`)
})

router.get('/lib', async (req, res) => {
    if (req.oidc.user === undefined) {
        res.render('articles/index')
    }
    else {
        let articles = await Article.find().sort({ currentDate: 'desc' })
        let fullProj = await Article.find({ teacher: req.query.teacher, status: req.query.stat })
        let statProj = await Article.find({ status: req.query.stat })
        let teachProj = await Article.find({ teacher: req.query.teacher })
        let titleProj = await Article.find({ title: { $regex: new RegExp('.*' + req.query.name + '.*') } })

        console.log(typeof req.query.name)
        console.log(req.query.name)
        if (req.query.name == 'undefined' || req.query.name == null) {
            if ((req.query.teacher == null || req.query.teacher == 'undefined') && (req.query.stat == 100 || req.query.stat == null || req.query.stat == 'undefined')) {
                res.render('articles/lib', { articles, user: req.oidc.user.email })
            }
            else if (!(req.query.stat == 100) && (req.query.teacher == 'undefined' || req.query.teacher == null)) {
                res.render('articles/lib', { articles: statProj, user: req.oidc.user.email })
            }
            else if (!(req.query.teacher == 'undefined' || req.query.teacher == null) && req.query.stat == 100) {
                res.render('articles/lib', { articles: teachProj, user: req.oidc.user.email })
            }
            else {
                res.render('articles/lib', { articles: fullProj, user: req.oidc.user.email })
            }
        }
        else {
            res.render('articles/lib', { articles: titleProj, user: req.oidc.user.email })
        }
    }


})


//ddd

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article(), user: req.oidc.user.email })
})

router.get('/:slug', async (req, res) => {
    let article = await Article.findOne({ slug: req.params.slug })
    if (article == null) {
        res.redirect('/')
    } else {
        res.render('articles/show', { article: article, user: req.oidc.user.email })
    }
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article, user: req.oidc.user.email })
})

const saveArticleAndRedirect = (path) => {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.teacher = req.body.teacher
        article.dateDefense = req.body.dateDefense
        article.status = req.body.status

        console.log(req.body.dateDefense)
        console.log(typeof req.body.dateDefense)

        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            console.log(`ERROR IS ${e}`)
            res.render(`articles/${path}`, { article: article, user: req.oidc.user.email })
        }
    }
}

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/articles/lib')
})


module.exports = router