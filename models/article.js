const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)


//title
//year of defence 
//descript
//teacher
//status of the project --> 0/1/2


//filtration 


const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    teacher: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    dateDefense: {
        type: Date,
        default: Date.now,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitazedHtml: {
        type: String,
        required: true
    }
})



articleSchema.pre('validate', function(next) {
    if (this.title){
        this.slug = slugify(this.title, {lower: true, strict: true})
    }

    if (this.description){
        this.sanitazedHtml = dompurify.sanitize(marked(this.description))
    }
    next()


})


module.exports = mongoose.model('Article', articleSchema)