let MemoryCode = require('./memoryGameJs')
let DragFile = require('./drag')
let ChatFile = require('./chat')
let VideoFile = require('./video')

let ul = document.querySelector('#appList')

const memGame = 'Memory Game'
const chatApp = 'Chat Application'
const videoApp = 'Video Application'

let videoAppOpen = false

let memCounter = 0
let chatCounter = 0
let dragCounter = 0

let topPosition = 0
let leftPosition = 0

ul.addEventListener('click', event => {
  event.preventDefault()

  topPosition = topPosition + 20
  leftPosition = leftPosition + 20

  let newWindowApp = event.target.getAttribute('data-app-title')

  if (newWindowApp === memGame) {
    memCounter++
    dragCounter++

    let imageDiv = document.createElement('div')
    imageDiv.id = 'imageDiv' + memCounter
    imageDiv.classList.add('memoryWindow')

    document.querySelector('#container').appendChild(imageDiv)

    let dragAbleDiv = document.createElement('div')
    dragAbleDiv.id = 'dragAbleDiv' + dragCounter
    dragAbleDiv.classList.add('dragableWindow')

    let closeButton = document.createElement('input')
    closeButton.type = 'button'
    closeButton.value = 'X'
    closeButton.classList.add('closeButton')

    let queryImage = document.querySelector('#imageDiv' + memCounter)
    queryImage.appendChild(dragAbleDiv)
    queryImage.style.position = 'absolute'
    queryImage.style.top = topPosition + 'px'
    queryImage.style.left = leftPosition + 'px'
    document.querySelector('#dragAbleDiv' + dragCounter).appendChild(closeButton)

    let queryDragAbleDiv = document.querySelector('#dragAbleDiv' + dragCounter)
    createWindowIcon('/image/memory.png', queryDragAbleDiv)
    createWindowText('Memory Application', queryDragAbleDiv)

    closeButton.addEventListener('click', event => {
      queryImage.remove()
    })

    DragFile(dragAbleDiv)
    MemoryCode(memCounter, dragCounter)
  } else if (newWindowApp === chatApp) {
    chatCounter++
    dragCounter++

    let chatDiv = document.createElement('div')
    chatDiv.id = 'chatDiv' + chatCounter
    chatDiv.classList.add('chatWindow')
    document.querySelector('#container').appendChild(chatDiv)

    let dragAbleDiv = document.createElement('div')
    dragAbleDiv.id = 'dragAbleDiv' + dragCounter
    dragAbleDiv.classList.add('dragableWindow')
    let queryChat = document.querySelector('#chatDiv' + chatCounter)
    queryChat.appendChild(dragAbleDiv)
    queryChat.style.position = 'absolute'
    queryChat.style.top = topPosition + 'px'
    queryChat.style.left = leftPosition + 'px'

    let queryDragAbleDiv = document.querySelector('#dragAbleDiv' + dragCounter)

    let closeButton = document.createElement('input')
    closeButton.type = 'button'
    closeButton.value = 'X'
    closeButton.classList.add('closeButton')
    queryDragAbleDiv.appendChild(closeButton)

    createWindowIcon('/image/chat.png', queryDragAbleDiv)

    createWindowText('Chat Application', queryDragAbleDiv)

    ChatFile(chatDiv, dragCounter)
    DragFile(dragAbleDiv)
  } else if (newWindowApp === videoApp) {
    if (!videoAppOpen) {
      videoAppOpen = true
      dragCounter++

      let newDiv = document.createElement('div')
      newDiv.id = 'videoDiv'
      newDiv.classList.add('videoClass')

      let dragAbleDiv = document.createElement('div')
      dragAbleDiv.id = 'dragAbleDiv' + dragCounter
      dragAbleDiv.classList.add('dragableWindow')

      document.querySelector('#container').appendChild(newDiv)
      let queryVideoDiv = document.querySelector('#videoDiv')

      queryVideoDiv.appendChild(dragAbleDiv)
      queryVideoDiv.style.position = 'absolute'
      queryVideoDiv.style.top = topPosition + 'px'
      queryVideoDiv.style.left = leftPosition + 'px'

      let queryDragableDiv = document.querySelector('#dragAbleDiv' + dragCounter)

      createVideoCloseButton(queryDragableDiv)

      let queryCloseButton = document.querySelector('#videoCloseButton')

      queryCloseButton.addEventListener('click', event => {
        videoAppOpen = false
      })

      createWindowIcon('/image/camera.png', queryDragableDiv)

      createWindowText('Photo Application', queryDragableDiv)

      VideoFile(queryVideoDiv)
      DragFile(dragAbleDiv)
    }
  }
})

/**
 * This creates a close button for the photo application
 * @param {*} div is the top bar where the button should be placed
 */
function createVideoCloseButton (div) {
  let closeButton = document.createElement('input')
  closeButton.type = 'button'
  closeButton.value = 'X'
  closeButton.id = 'videoCloseButton'
  closeButton.classList.add('closeButton')
  div.appendChild(closeButton)
}

/**
 * This creates an icon for the a window
 * @param {*} image is the icon
 * @param {*} div is the top bar where the icon should be placed
 */
function createWindowIcon (image, div) {
  let windowIcon = document.createElement('img')
  windowIcon.src = image
  windowIcon.classList.add('memoryIcon')
  div.appendChild(windowIcon)
}

/**
 * This creates the text of the application
 * @param {*} text is the name of the application
 * @param {*} div is the top bar where the text should be placed
 */
function createWindowText (text, div) {
  let windowText = document.createElement('span')
  windowText.classList.add('windowText')
  windowText.appendChild(document.createTextNode(text))
  div.appendChild(windowText)
}
