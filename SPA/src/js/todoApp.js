'use strict'

module.exports = function (todoDiv) {
  let itemCounter = 0
  let todoTemplate = document.querySelector('#todoTemplate')
  let clone = document.importNode(todoTemplate.content, true)

  let listDiv = clone.querySelector('div')
  listDiv.id = 'listDiv'
  listDiv.classList.add('messagesDiv')
  let itemText = clone.querySelector('.inputTextClass')
  let button = clone.querySelector('.inputButtonClass')

  document.querySelector('#' + todoDiv.id).appendChild(clone)

  button.addEventListener('click', event => {
    itemCounter++
    let listItem = document.createElement('label')
    listItem.style.float = 'left'
    listItem.style.height = '20px'
    listItem.id = 'item' + itemCounter
    let img = document.createElement('img')
    img.id = 'img' + itemCounter
    img.src = '../image/greyCheck.png'
    img.style.float = 'right'
    img.style.height = '20px'
    listItem.innerText = itemText.value

    document.querySelector('#listDiv').appendChild(listItem)
    document.querySelector('#listDiv').appendChild(img)
    document.querySelector('#listDiv').appendChild(document.createElement('br'))
    document.querySelector('#listDiv').appendChild(document.createElement('br'))
  })
}
