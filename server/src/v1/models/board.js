const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const boardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon: {
        type: String,
        default: '📜'
    },
    title: {
        type: String,
        default: 'untitled'
    },
    description: {
        type: String,
        default: `Add descripton here
        🟢​ You can add multiline description
        🟢​ Let's Start...`
    },
    position: {
        type: Number
    },
    favourites: {
        type: Boolean,
        default: false
    },
    favouritePosition: {
        type: Number,
        default: 0
    }
}, schemaOptions)

module.exports = mongoose.model('Board', boardSchema)