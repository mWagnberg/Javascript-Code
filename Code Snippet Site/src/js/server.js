'use strict'

let dbHandler = require('./dbHandler')
let express = require('express')
let session = require('express-session')
let path = require('path')
let app = express()
let handlebars = require('express-handlebars')
let bodyParser = require('body-parser')
let bcrypt = require('bcrypt-nodejs')
let flash = require('express-flash-2')
let maxAgeCookie = 1000 * 60 * 60 * 24

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Setup the session
 */
app.use(session({
  name: 'myname',
  secret: 'gamingIsForLozzzers',
  saveUninitialized: false, // save/not-save a created but not modified session
  resave: false, // resave even if a request is not changing the session
  cookie: {
    secure: false, // should be true to check that we´re using HTTPS
    httpOnly: true, // dont allow client script messing with the cookie
    maxAge: maxAgeCookie // Millisecond
  }
}))

/**
 * This is for using flash messages
 */
app.use(flash())

/**
 * Use this to specify a path to static files
 */
app.use(express.static(path.join(__dirname, '../public')))

/**
 * This is for telling main is the default handlebar
 */
app.engine('.handlebars', handlebars({
  defaultLayout: 'main',
  extname: '.handlebars'
}))

app.set('view engine', '.handlebars')

/**
 * This is getting a index page, depending if a user is logged in or not
 */
app.get('/', function (request, response) {
  let Model = dbHandler.SnippetModel
  Model.find(function (error, data) {
    if (error) {
      return console.error(error)
    }

    if (request.session.user) {
      response.render('userIndex', {snippets: data})
    } else {
      response.render('index', {snippets: data})
    }
  })
})

/**
 * This gets the register page
 */
app.get('/register', function (request, response) {
  response.render('partials/register')
})

/**
 * This page are showing the users snippets where he/she can remove/create/update snippets
 */
app.get('/userPage', function (request, response) {
  if (request.session.user) {
    let userSnippets = dbHandler.SnippetModel
    userSnippets.find({'userId': request.session.user._id}, function (error, data) {
      if (error) {
        return console.error(error)
      }
      response.render('layouts/userPage', {snippets: data})
    })
  } else {
    response.redirect('/')
  }
})

/**
 * This checks the user. If the user exist, if so, the correct password. Flash message shows if password is incorrect
 * or user doesnt exist
 */
app.post('/login', function (request, response) {
  dbHandler.userModel.findOne({'username': request.body.username}, function (error, user) {
    if (error) {
      return console.error(error)
    }
    if (user) {
      if (bcrypt.compare(request.body.password, user.password, function (err, res) {
        if (err) {
          return (err)
        }
        if (res) {
          request.session.user = user
          response.redirect('/userPage')
        } else {
          request.session.flash = {
            type: 'failMess',
            message: 'Wrong Password'
          }
          response.redirect('/')
        }
      })) {
      }
    } else {
      request.session.flash = {
        type: 'failMess',
        message: 'User does not exist'
      }
      response.redirect('/')
    }
  })
})

/**
 * If the user want to logout, his/her session dies
 */
app.post('/logout', function (request, response) {
  if (request.session.user) {
    request.session.destroy()
  }
  response.redirect('/')
})

/**
 * This register a new user to the database
 */
app.post('/registerUser', function (request, response) {
  let UserModel = dbHandler.userModel
  let newUser = new UserModel()

  newUser.username = request.body.username
  newUser.password = request.body.password

  console.log('New User' + newUser)
  newUser.save()

  response.redirect('/')
})

/**
 * This will post a new snippet to the database and it will have a user tach to it
 */
app.post('/posta', function (request, response) {
  let SnippetModel = dbHandler.SnippetModel
  let newSnippet = new SnippetModel()

  if (request.session.user) {
    newSnippet.snippet = request.body.snippetArea
    newSnippet.userId = request.session.user._id
    newSnippet.username = request.session.user.username
    console.log(newSnippet)
    newSnippet.save()
    request.session.flash = {
      type: 'successMess',
      message: 'Upload Snippet'
    }
  } else {
    request.session.flash = {
      type: 'failMess',
      message: 'Could not upload snippet'
    }
  }

  response.redirect('/userPage')
})

/**
 * This will remove a snippet
 */
app.post('/remove/:id', function (request, response) {
  let SnippetModel = dbHandler.SnippetModel
  SnippetModel.findOneAndRemove({_id: request.params.id}, function (error) {
    if (error) {
      return console.error(error)
    }
    response.redirect('/userPage')
  })
})

/**
 * This will update a snippet
 */
app.post('/update/:id', function (request, response) {
  console.log(request.body.updateSnippetArea)
  let SnippetModel = dbHandler.SnippetModel
  SnippetModel.findOneAndUpdate(
    {_id: request.params.id},
    {$set: {snippet: request.body.updateSnippetArea}},
    {new: true}, function (error, doc) {
      if (error) {
        return console.error(error)
      }

      response.redirect('/userPage')
    })
})

// Specify the port
let port = process.env.port || 8000

/**
 * Start the server
 */
function startServer () {
  app.listen(port, function () {
    console.log('Listens to port: ' + port)
  })
}

module.exports.startServer = startServer

/**
 * This is used for flash messages
 */
app.use(function (request, response) {
  if (request.session.flash) {
    response.locals.flash = request.session.flash
    delete request.session.flash
  }
})
