'use strict'

const fetch = require('node-fetch')
let answerURL = ''
let h1Timer = document.querySelector('#timer')
let timeOut
let scoreCounter = 0
let nickname = ''
let nicknameBoolean = false
const startURL = 'http://localhost:4000'

/**
 * This function counts down to zero
 * @param {counter} counter is the countdown variable 
 */
function timerFunction (counter) {
  timeOut = setTimeout(function () {
    h1Timer.textContent = counter
    counter--
    scoreCounter++
    if (counter < 0) {
      gameOver()
    } else {
      timerFunction(counter)
    }
  }, 1000)
}

/**
 * This function will apear when time is up
 */
function gameOver () {
  clearTimeout(timeOut)
  clearTemplateDiv()
  let timesUp = 'Time\'s up! You did\'nt make it!'
  displayStartOver(timesUp)
}

/**
 * This function will fetch a url and get a question from that and put it in the form
 * @param {url} url is the url thats gonna på fetched
 */
async function fetchQuestion (url) {
  if (nicknameBoolean === false) {
    nickname = document.querySelector('#startTextInput input').value
    nicknameBoolean = true
  }
  clearTimeout(timeOut)
  timerFunction(20)
  let form = document.querySelector('#formId')
  form.reset()
  let questionText = document.querySelector('#question')
  const response = await fetch(url)
  const data = await response.json()
  answerURL = data.nextURL

  clearTemplateDiv()

  if (data.hasOwnProperty('alternatives')) {
    if (Object.keys(data.alternatives).length > 0) {
      let templateTag = document.querySelector('#templateTag')
      let altArr = Object.values(data.alternatives)
      for (let i = 0; i < Object.keys(data.alternatives).length; i++) {
        let clone = document.importNode(templateTag.content, true)
        let label = clone.querySelector('label')
        label.id = 'alt' + (i + 1)
        label.innerText = altArr[i]
        document.querySelector('#templateDiv').appendChild(clone)
      }

      questionText.textContent = data.question
    }
  } else {
    let templateTag = document.querySelector('#textInputTemplate')
    let clone = document.importNode(templateTag.content, true)
    document.querySelector('#templateDiv').appendChild(clone)
    questionText.textContent = data.question
  }
}

/**
 * This function will send what ever the user is answering
 * @param {e} e is the event
 */
function sendAnswer (e) {
  e.preventDefault()

  fetch(answerURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: ckeckCheckbox()
  })
  .then((res) => res.json())
  .then(data => {
    if (data.nextURL === undefined) {
      clearTimeout(timeOut)
      if (data.message === 'Wrong answer! :(') {
        let wrongAnswer = 'Wrong answer!'
        clearTemplateDiv()
        displayStartOver(wrongAnswer)
      } else {
        addToHighScore()
        displayHighScore()
      }
    } else {
      fetchQuestion(data.nextURL)
    }
  })
  .catch(error => {
    console.log(error)
  })
}

/**
 * This function will clear the section where the question is
 */
function clearTemplateDiv () {
  let templateDiv = document.querySelector('#templateDiv')
  while (templateDiv.firstChild) {
    templateDiv.removeChild(templateDiv.firstChild)
  }
}

/**
 * This function adds the nickname and the score to the highscore
 */
function addToHighScore () {
  if (localStorage.length === 1) {
    localStorage.setItem(JSON.stringify(scoreCounter), nickname)
  }
    for (let i = 0; i < localStorage.length; i++) {
      let h3nameAndScore = document.createElement('h3')
      let keyVar = localStorage.key(i)
      let valueVar = localStorage.getItem(keyVar)
  
        if (scoreCounter < keyVar) {
          localStorage.removeItem(JSON.stringify(keyVar), valueVar)
          localStorage.setItem(JSON.stringify(scoreCounter), nickname)
          localStorage.setItem(keyVar, valueVar)
        }
    }
    
    // Add score if slower than thoose existing scores in highscore
    localStorage.setItem(JSON.stringify(scoreCounter), nickname)

    if (localStorage.length >= 6) {
    localStorage.removeItem(localStorage.key(localStorage.length-2))
  }
}

/**
 * This function will apear when the user picks the wrong answer or when the game is finish
 * @param {section} section is the the text that will be shown 
 */
function displayStartOver (section) {
  let h2wrongAnswer = document.querySelector('#h2wrongAnswer')
  h2wrongAnswer.textContent = section

  let startOverBtn = document.createElement('button')
  startOverBtn.textContent = 'Start Over'
  document.querySelector('#wrongAnswer').appendChild(startOverBtn)
  startOverBtn.addEventListener('click', event => {
    window.location.href = startURL
  })
}

/**
 * This function displays the highscore
 */
function displayHighScore () {
  for (let i = 0; i < localStorage.length; i++) {
    let h2Id = document.querySelector('#h2Id')
    h2Id.textContent = 'RESULT'
    let h3nameAndScore = document.createElement('h3')
    let keyVar = localStorage.key(i)
    let valueVar = localStorage.getItem(keyVar)

    if (valueVar !== 'INFO') {
      h3nameAndScore.textContent = valueVar + ' ' + keyVar
      document.querySelector('#resultDiv').appendChild(h3nameAndScore)
    }
  }

  let playAgain = 'Play again?'
  displayStartOver(playAgain)
}

/**
 * This function checks which alternative the user has picked
 */
function ckeckCheckbox () {
  let boxes = document.querySelectorAll('input[type=\'radio\']')
  if (boxes.length > 0) {
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].checked === true) {
        let returnString = 'alt' + (i + 1)
        return JSON.stringify({answer: returnString})
      }
    }
  } else {
    let answerText = document.querySelector('#answerText').value
    return JSON.stringify({answer: answerText})
  }
}

export {fetchQuestion}
export {sendAnswer}
