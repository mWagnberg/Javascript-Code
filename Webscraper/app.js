'use strict'

let cheerio = require('cheerio')
let request = require('request')
let url = require('url')

let fetchUrl = require('./lib/fetchWebSite')

// If there's not an argument with an url the program will stop
let startUrl = process.argv[2]
if (startUrl === undefined) {
  console.log('You must have an argument containing an url')
  process.exit(0)
}

let hostUrl = 'http://' + url.parse(startUrl).host
let friday = 0
let saturday = 0
let sunday = 0

let calendar
let theCinema
let zekesRestaurant

let movieAvailable = 1

let restaurantCounter = 0

/**
 * This fetches the links in the start page and setting them to its global variables
 */
fetchUrl.fetchUrl(startUrl).then(function (data) {
  calendar = cheerio.load(data)('a').eq(0)
  theCinema = cheerio.load(data)('a').eq(1)
  zekesRestaurant = cheerio.load(data)('a').eq(2)

  console.log('Fetching links... OK')

  let calendarTag = calendar.attr('href')

  calendarFunction(calendarTag)
})

/**
 * This function checks all the available days for each person and if every person
 * is available on the same day(s) it will pass it forward to the cinema function
 * @param {String} calendarUrl is the calendar url
 */
function calendarFunction (calendarUrl) {
  fetchUrl.fetchUrl(calendarUrl)
  .then(function (calendarData) {
    console.log('Fetching free days... OK')

    let lengthOfList = cheerio.load(calendarData)('a').length

    for (let i = 0; i < lengthOfList; i++) {
      let person = cheerio.load(calendarData)('a').eq(i).attr('href')
      fetchUrl.fetchUrl(calendarUrl + person)
      .then(function (data) {
        if (cheerio.load(data)('td').eq(0).text().toLowerCase() === 'ok') {
          friday++
        } if (cheerio.load(data)('td').eq(1).text().toLowerCase() === 'ok') {
          saturday++
        } if (cheerio.load(data)('td').eq(2).text().toLowerCase() === 'ok') {
          sunday++
        }
      })
      .then(function (data) {
        if (friday === lengthOfList) {
          cinemaFunction('05')
        } if (saturday === 3) {
          cinemaFunction('06')
        } if (sunday === 3) {
          cinemaFunction('07')
        }
      })
    }
  })
}

/**
 * This function checks all available movies that the company can see
 * and takes out the information about the movies by fetching that movie's url
 * and then pass it forward to the restaurant function
 * @param {String} day is the value of the movie
 */
function cinemaFunction (day) {
  console.log('Fetching movie shows... OK')

  fetchUrl.fetchUrl(theCinema.attr('href'))
  .then(function (data) {
    let cinemaUrl = theCinema.attr('href')
    let cinemaLength = cheerio.load(data)('#movie option').length
    let test = cheerio.load(data)('#movie option')

    for (let i = 1; i < cinemaLength; i++) {
      fetchUrl.fetchUrl(cinemaUrl + '/check?day=' + day + '&movie=0' + i)
      .then(function (checkData) {
        let parsedData = JSON.parse(checkData)
        for (let j = 0; j < parsedData.length; j++) {
          if (parsedData[j].status === movieAvailable) {
            let movieTitle
            for (let k = 0; k < cinemaLength; k++) {
              if (test.eq(k).attr('value') === parsedData[j].movie) {
                movieTitle = test.eq(k).text()
              }
            }
            restaurantFunction(parsedData[j], cinemaLength, movieTitle)
          }
        }
      })
    }
  })
}

/**
 * This function checks the available tables in Zekes Restaurant depending on the
 * persons available days and available movie slots. Then print out the information
 * about day, movie and restaurant booking.
 * @param {JSON} movieInfo is the JSON object that contains information about the movie
 * @param {Number} maxAmountOpportunity is a counter
 * @param {String} movieTitle is the title of the movie
 */
function restaurantFunction (movieInfo, maxAmountOpportunity, movieTitle) {
  restaurantCounter++
  if (restaurantCounter === maxAmountOpportunity) {
    console.log('Fetching restaurant bookings... OK \n')
  }

  let readyToEatTime = parseInt(movieInfo.time.substring(0, 2)) + 2

  fetchUrl.fetchUrl(zekesRestaurant.attr('href'))
  .then(function (data) {
    let nextLocation = cheerio.load(data)('form').attr('action')

    request.post(hostUrl + nextLocation, {json: {'username': 'zeke', 'password': 'coys'}}, function (error, response, body) {
      let bookingUrl = zekesRestaurant.attr('href') + '/' + response.headers.location
      if (error) {
        return error
      }

      fetchUrl.fetchUrl(bookingUrl, response.headers['set-cookie'])
      .then(function (data) {
        let radioLength = cheerio.load(data)(':radio').length
        for (let i = 0; i < radioLength; i++) {
          let radioBtn = cheerio.load(data)(':radio').eq(i).attr('value')
          let startTime = radioBtn.substring(3, 5)
          let endTime = radioBtn.substring(5, radioBtn.length)

          if (radioBtn.startsWith('fri') && movieInfo.day === '05') {
            if (readyToEatTime < endTime) {
              console.log('* On Friday there is a free table between ' + startTime + ':00 and ' +
              endTime + ':00, after you have seen "' + movieTitle + '" which starts at ' + movieInfo.time + '\n')
            }
          }
          if (radioBtn.startsWith('sat') && movieInfo.day === '06') {
            if (readyToEatTime < endTime) {
              console.log('* On Saturday there is a free table between ' + startTime + ':00 and ' +
              endTime + ':00, after you have seen "' + movieTitle + '" which starts at ' + movieInfo.time + '\n')
            }
          }
          if (radioBtn.startsWith('sun') && movieInfo.day === '07') {
            if (readyToEatTime < endTime) {
              console.log('* On Sunday there is a free table between ' + startTime + ':00 and ' +
              endTime + ':00, after you have seen "' + movieTitle + '" which starts at ' + movieInfo.time + '\n')
            }
          }
        }
      })
    })
  })
}
