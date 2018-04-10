'use strict'
let request = require('request')

module.exports = {
  fetchUrl: fetchUrl
}

/**
 * This function gets an url's html
 * @param {String} url is the url
 * @param {String} inputCookie is the cookie (used for authentication)
 */
function fetchUrl (url, inputCookie) {
  return new Promise(function (resolve, reject) {
    request(url, {headers: {cookie: inputCookie}}, function (error, response, html) {
      if (error) {
        return reject(error)
      }

      if (response.statusCode !== 200) {
        return reject(new Error('A not okay status code: ' + response.statusCode))
      }

      resolve(html)
    })
  })
}
