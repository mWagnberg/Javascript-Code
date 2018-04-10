'use strict'

module.exports = function (chatDiv, dragCounter) {
  // Check if there is a nickname in localStorage
  if (window.localStorage.getItem('chatNickname') === null) {
    createNickname()
  } else {
    setupChat()
  }

  /**
   * This function will be called if there's no nickname saved
   */
  function createNickname () {
    let textField = document.createElement('input')
    textField.type = 'text'
    textField.classList.add('textField')
    let button = document.createElement('input')
    button.type = 'submit'
    button.classList.add('buttonClass')
    let text = document.createElement('h1')
    text.textContent = 'Choose your user name'

    let memDiv = document.querySelector('#' + chatDiv.id)
    memDiv.appendChild(text)
    memDiv.appendChild(textField)
    memDiv.appendChild(button)

    button.addEventListener('click', event => {
      window.localStorage.setItem('chatNickname', textField.value)
      textField.remove()
      button.remove()
      text.remove()
      setupChat()
    })

    // This close the chat window
    let closeButton = document.querySelector('#dragAbleDiv' + dragCounter).firstChild
    closeButton.addEventListener('click', event => {
      let memDiv = document.querySelector('#' + chatDiv.id)
      memDiv.remove()
    })
  }

  /**
   * This function will set up connection to the server. It will send whatever the user writes to the server
   * and put all the data from all the chat members on the chat window
   */
  function setupChat () {
    let chatTemplate = document.querySelector('#chatTemplate')
    let clone = document.importNode(chatTemplate.content, true)

    let messagesDiv = clone.querySelector('div')
    messagesDiv.classList.add('messagesDiv')

    let inputText = clone.querySelector('.inputTextClass')
    let button = clone.querySelector('.inputButtonClass')
    button.value = 'Send'
    button.style.float = 'right'

    let changeUserNameButton = clone.querySelector('.changeUserNameButtonClass')
    changeUserNameButton.value = 'Change User Name'
    changeUserNameButton.style.float = 'left'

    // Getting the smiley temlate, and if the user presses a smiley, that smiley will appear in the text field
    let smileyUl = clone.querySelector('ul')
    smileyUl.addEventListener('click', event => {
      event.preventDefault()

      let smileyIcon = event.target.getAttribute('data-smiley-name')
      if (smileyIcon === 'smiley') {
        inputText.value += String.fromCodePoint(0x1f600)
      } else if (smileyIcon === 'bigSmiley') {
        inputText.value += String.fromCodePoint(0x1f601)
      } else if (smileyIcon === 'winkSmiley') {
        inputText.value += String.fromCodePoint(0x1f609)
      } else if (smileyIcon === 'sadSmiley') {
        inputText.value += String.fromCodePoint(0x1f614)
      }
    })

    document.querySelector('#' + chatDiv.id).appendChild(clone)

    let day = new Date()
    let currentDate = document.createElement('span')
    currentDate.classList.add('colorOnTime')
    currentDate.appendChild(document.createTextNode('Welcome, today it is ' + day.toLocaleDateString('en-US', { weekday: 'long' }) + ' - ' + day.getDate() + '/' + day.getMonth()))
    messagesDiv.appendChild(currentDate)
    messagesDiv.appendChild(document.createElement('br'))

    // Setup socket
    let socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'mickeChannel')

    // Create JSON-object that will be sent
    let data = {
      type: 'message',
      data: 'test',
      username: window.localStorage.getItem('chatNickname'),
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    // This gets all the messages that is sent to the server and prints it out with its current time
    socket.addEventListener('message', event => {
      console.log('From server: ' + event.data)
      let parsedData = JSON.parse(event.data)
      if (parsedData.type === 'message' || parsedData.type === 'notification') {
        let time = new Date()

        let currentTime = document.createElement('span')
        currentTime.classList.add('colorOnTime')
        currentTime.appendChild(document.createTextNode(time.getHours() + ':' + time.getMinutes() + ' '))
        let parsedMessage = document.createElement('span')
        if (parsedData.username === window.localStorage.getItem('chatNickname')) {
          parsedMessage.classList.add('parsedMessage')
        }
        messagesDiv.appendChild(currentTime)

        parsedMessage.appendChild(document.createTextNode(parsedData.username + ': ' + parsedData.data))
        messagesDiv.appendChild(parsedMessage)
        messagesDiv.appendChild(document.createElement('br'))

        // This is for making the text appear on the next line instead of scrolling to the right
        messagesDiv.scrollTop = messagesDiv.scrollHeight
      }
    })

    // This sends the message to the server
    button.addEventListener('click', event => {
      console.log(inputText.value)
      data.data = inputText.value
      socket.send(JSON.stringify(data))
      inputText.value = ''
    })

    // This changes the nickname, but you have to close the window before it kicks in
    changeUserNameButton.addEventListener('click', event => {
      window.localStorage.removeItem('chatNickname')
      window.localStorage.setItem('chatNickname', inputText.value)
    })

    // This close the socket and the chat window
    let closeButton = document.querySelector('#dragAbleDiv' + dragCounter).firstChild
    closeButton.addEventListener('click', event => {
      socket.close()
      let memDiv = document.querySelector('#' + chatDiv.id)
      memDiv.remove()
    })
  }
}
