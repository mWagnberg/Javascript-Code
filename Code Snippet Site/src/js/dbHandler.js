'use strict'

let mongoose = require('mongoose')
let bcrypt = require('bcrypt-nodejs')

const dbURI = 'mongodb://micke:micke123@ds123146.mlab.com:23146/code_snippets'
let db = mongoose.connection

let salt = 10

db.on('error', function () {
  console.log('We got a connection error!')
})

db.once('open', function () {
  console.log('Succesfully connected to mongoDB')
})

mongoose.connect(dbURI, {
  useMongoClient: true
})

// Here's the schema for the users
let userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  updated: { type: Date, default: Date.now }
})

// Here's the schema for the snippets
let snippetSchema = new mongoose.Schema({
  snippet: String,
  userId: String,
  username: String
})

/**
 * This is for hashing the users password
 */
userSchema.pre('save', function (next) {
  let user = this
  bcrypt.genSalt(salt, function (err, salt) {
    if (err) {
      return next(err)
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err)
      }

      user.password = hash
      next()
    })
  })
})

// This are the Models
let userModel = mongoose.model('userModel', userSchema)
let SnippetModel = mongoose.model('SnippetModel', snippetSchema)

module.exports.userModel = userModel
module.exports.SnippetModel = SnippetModel
