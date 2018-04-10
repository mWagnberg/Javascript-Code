'use strict'

let express = require('express')
let bodyParser = require('body-parser')
let handlebars = require('express-handlebars')
let request = require('request')
let socket = require('socket.io')

let app = express()
let port = process.env.PORT || 3000
let issueUrl = 'https://api.github.com/repos/1dv523/mw222uu-examination-3/issues'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * This is for telling main is the default handlebar
 */
app.engine('.handlebars', handlebars({
  defaultLayout: 'main',
  extname: '.handlebars'
}))

app.set('view engine', '.handlebars')

let server = app.listen(port, function () {
  console.log('Start server')
})

let io = socket(server)

io.on('connection', function (socket) {
  console.log('We have a connection')
})

/**
 * This function calls whenever the start page is requested and this will send my credentials to github with my secret key that's placed
 * in my environment varibles
 * @param {*} url is the url to github for getting all the issues for this assignment repository
 */
function fetchUrl (url) {
  return new Promise(function (resolve, reject) {
    request(url, {headers: {'Authorization': 'token ' + process.env.KEY, 'User-Agent': 'mWagnberg', 'Content-Security-Policy': 'connect-src self'}}, function (error, response, data) {
      if (error) {
        return reject(error)
      }
      resolve(data)
    })
  })
}

/**
 * When getting the start page, all the issues that are within the repository are sent to the DOM
 */
app.get('/', function (req, res) {
  fetchUrl(issueUrl).then(function (data) {
    let jsonParsed = JSON.parse(data)
    console.log(jsonParsed)

    res.render('index', {issue: jsonParsed})
  })
})

/**
 * When something happens to an issue, github sends a post to the start page and then this post function sends the content of the body
 * to the client script via websockets
 */
app.post('/', function (req, res) {
  io.emit('data', req.body)
  res.status(200).end('OK')
})
