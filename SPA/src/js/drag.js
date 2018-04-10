'use strict'
/**
 * I have taken some inspiration from http://jsfiddle.net/Lk2hLthp/1/ regarding the drag and drop window thing. I have added much
 * functionallity to fit this context.
 */

let z = 0
let windowSize = 900

module.exports = function (imageDiv) {
  let divId = '#' + imageDiv.id
  let xPosition = 0
  let yPosition = 0
  let documentBody = document.body
  let documentElement = document.documentElement

  let bodyBottom
  getDiv()

  /**
   * This function will be called when a user opens a new window
   */
  function getDiv () {
    z++
    let divElement = document.querySelector(divId)
    let parentElement = divElement.parentElement.id
    let parentDiv = document.querySelector('#' + parentElement)

    // Set new window in front of every other windows
    parentDiv.style.zIndex = z

    divElement.addEventListener('mousedown', mouseClickDown, false)
    window.addEventListener('mouseup', mouseClickUp, false)

    // This below is for making the windows not appear outside the desktop
    let measureOfContainer = document.querySelector('#container').getBoundingClientRect()
    let measureOfThisDiv = parentDiv.getBoundingClientRect()

    if (parentDiv.style.top < '0px') {
      parentDiv.style.top = '0px'
    } if (parentDiv.style.left < '0px') {
      parentDiv.style.left = '0px'
    } if (measureOfThisDiv.right > measureOfContainer.right) {
      parentDiv.style.left = (measureOfContainer.right - measureOfThisDiv.width) + 'px'
    } if (measureOfThisDiv.bottom > windowSize) {
      parentDiv.style.top = (windowSize - measureOfThisDiv.height) + 'px'
    }
  }

  /**
   * This function will be called when user starts dragging a window
   * @param {*} event
   */
  function mouseClickDown (event) {
    // This is for getting the size of the body when the user clicks on a window
    bodyBottom = Math.max(documentBody.scrollHeight, documentBody.offsetHeight, documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight)

    z++

    let divElement = document.querySelector(divId)
    let parentElement = divElement.parentElement.id
    let parentDiv = document.querySelector('#' + parentElement)
    parentDiv.style.zIndex = z

    xPosition = event.clientX - parentDiv.offsetLeft
    yPosition = event.clientY - parentDiv.offsetTop

    window.addEventListener('mousemove', dragWindow, true)
  }

  /**
   * This function will be called user stops dragging a window
   * @param {*} event
   */
  function mouseClickUp (event) {
    window.removeEventListener('mousemove', dragWindow, true)
  }

  /**
   * This function will be called when the user is dragging the window
   * @param {*} event
   */
  function dragWindow (event) {
    let divElement = document.querySelector(divId)
    let parentElement = divElement.parentElement.id
    let parentDiv = document.querySelector('#' + parentElement)
    parentDiv.style.top = (event.clientY - yPosition) + 'px'
    parentDiv.style.left = (event.clientX - xPosition) + 'px'

    // This below is for not be able to drag a window outside the desktop
    let measureOfContainer = document.querySelector('#container').getBoundingClientRect()
    let measureOfThisDiv = parentDiv.getBoundingClientRect()

    if (parentDiv.style.top < '0px') {
      parentDiv.style.top = '0px'
    } if (parentDiv.style.left < '0px') {
      parentDiv.style.left = '0px'
    } if (measureOfThisDiv.right > measureOfContainer.right) {
      parentDiv.style.left = (measureOfContainer.right - measureOfThisDiv.width) + 'px'
    } if (measureOfThisDiv.bottom > bodyBottom) {
      parentDiv.style.top = (bodyBottom - measureOfThisDiv.height) + 'px'
    }
  }
}
