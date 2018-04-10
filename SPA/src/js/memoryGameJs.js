'use strict'
module.exports = function (memCounter, dragCounter) {
  let resultArr = []
  // This counter is to check when player has picked up to images
  let counter = 0
  // This counter is for the attemps
  let scoreCounter = 0
  let nickname = ''
  const imageQuestionmark = './image/0.png'
  let winCounter = 0
  let amountOfBricks = 0
  setNicknameAndSize()

  /**
   * When new memory game is atarted a size and nickname are created
   */
  function setNicknameAndSize () {
    let brickDiv = document.createElement('div')
    brickDiv.id = 'brickDiv' + memCounter
    brickDiv.classList.add('centering')

    let textField = document.createElement('input')
    textField.type = 'text'
    textField.classList.add('textField')

    let button = document.createElement('input')
    button.type = 'button'
    button.value = 'Start'
    button.classList.add('buttonClass')

    let text = document.createElement('h1')
    text.textContent = 'Choose nickname and size of the brickboard'

    let memDiv = document.querySelector('#imageDiv' + memCounter)
    memDiv.appendChild(brickDiv)
    let queryBrickDiv = document.querySelector('#brickDiv' + memCounter)

    queryBrickDiv.appendChild(text)
    queryBrickDiv.appendChild(textField)
    queryBrickDiv.appendChild(button)

    // Setup the options to bricksize
    let templateTag = document.querySelector('#optionsTemplate')
    let clone = document.importNode(templateTag.content, true)

    // Getting the select tag containing the alternatives for bricksize
    let list = clone.querySelector('select')
    list.id = 'list' + memCounter
    list.classList.add('optionList')

    let optionDiv = clone.querySelector('div')
    clone.querySelectorAll('option')
    queryBrickDiv.appendChild(clone)

    button.addEventListener('click', event => {
      nickname = textField.value

      let queryList = document.querySelector('#list' + memCounter)
      let optionValue = parseInt(queryList.value)

      textField.remove()
      button.remove()
      text.remove()
      clearDiv(optionDiv)

      print(optionValue)
    })
  }

  /**
   * This will print out the bricks and set eventlistener on every brick
   * @param {*} imageArr is a randomized array of integers
   * @param {*} amount refering to the bricksize
   */
  function showImages (imageArr, amount) {
    console.log(amount)
    let imageTemplate = document.querySelector('#memoryTemplate')

    // Loop through the array and set the back to the bricks and also set eventListener to every brick
    for (let i = 0; i < imageArr.length; i++) {
      let clone = document.importNode(imageTemplate.content, true)
      let image = clone.querySelector('img')
      let a = clone.querySelector('a')
      image.setAttribute('src', imageQuestionmark)
      document.querySelector('#brickDiv' + memCounter).appendChild(clone)

      // This is for setting the playfield by creating linebreaks
      if ((i + 1) % amount === 0) {
        let breakLine = document.createElement('br')
        document.querySelector('#brickDiv' + memCounter).appendChild(breakLine)
      }

      a.addEventListener('click', function btnClicked (event) {
        let changedImage = changeImage(imageArr[i], imageArr)
        image.setAttribute('src', changedImage)
        image.classList.add('image' + i)

        counter++

        resultArr.push(image)

        if (counter === 2) {
          let brick1 = resultArr[0]
          let brick2 = resultArr[1]

          if (brick1.getAttribute('class') === brick2.getAttribute('class')) {
            resultArr.shift()
            counter = 1
          } else {
            checkIfSame()
          }
        }
      })
    }
  }

  /**
   * This will change the questionmark image to the "other side"
   * @param {*} number is a number (element) from the image array
   * @param {*} array is the image array
   */
  function changeImage (number, array) {
    for (let i = 0; i < array.length; i++) {
      if (number === i) {
        return './image/' + i + '.png'
      }
    }
  }

  /**
   * This will check if you the two bricks that are up is the same.
   * If they are the same, those will hide from the playfield,
   * if not the will turn to the back again
   */
  function checkIfSame () {
    let brick1 = resultArr[0]
    let brick2 = resultArr[1]

    if (brick1.src === brick2.src) {
      setTimeout(function () {
        brick1.parentNode.classList.add('hideImage')
        brick2.parentNode.classList.add('hideImage')
      }, 500)

      winCounter++

      if (winCounter === amountOfBricks) {
        scoreCounter++
        let memDiv = document.querySelector('#brickDiv' + memCounter)
        clearDiv(memDiv)
        win()
      }
    } else {
      setTimeout(function () {
        brick1.src = imageQuestionmark
        brick2.src = imageQuestionmark
      }, 500)
    }

    counter = 0
    resultArr = []
    scoreCounter++
  }

  /**
   * This is used for removing the window before the playfield is shown, or when winning
   * @param {*} divThatWillBeCleared is the window that will be empty
   */
  function clearDiv (divThatWillBeCleared) {
    while (divThatWillBeCleared.firstChild) {
      divThatWillBeCleared.removeChild(divThatWillBeCleared.firstChild)
    }
  }

  /**
   * This will happen if all the bricks in the playfield are gone.
   * It will present the nickname, if any, and the score.
   * Click the button for a new game
   */
  function win () {
    let winText = document.createElement('h1')

    if (nickname === '') {
      nickname = 'You'
    }

    winText.textContent = nickname + ' won with ' + scoreCounter + ' points!'

    let divDelete = document.querySelector('#brickDiv' + memCounter)
    divDelete.appendChild(winText)

    let button = document.createElement('input')
    button.type = 'button'
    button.classList.add('buttonClass')
    button.value = 'New game'

    document.querySelector('#brickDiv' + memCounter).appendChild(button)

    button.addEventListener('click', event => {
      scoreCounter = 0
      winCounter = 0
      clearDiv(divDelete)
      setNicknameAndSize()
    })
  }

  /**
   * This will create an array of size that the user has decide and then return a randomized array
   * @param {*} amount is the amount (times 2) of bricks on the playfield
   */
  function print (amount) {
    amountOfBricks = amount
    let imageArr = []
    for (let i = 1; i < amount + 1; i++) {
      imageArr.push(i)
      imageArr.push(i)
    }

    let randomImageArr = imageArr.sort(function (a, b) {
      return 0.5 - Math.random(1000)
    })

    showImages(randomImageArr, amount)
  }
}
