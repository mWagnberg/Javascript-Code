'use strict'
module.exports = function (divElement) {
  let divId = '#' + divElement.id
  let surroundingDiv = document.querySelector(divId)

  let spot = document.createElement('div')
  spot.classList.add('spotClass')
  surroundingDiv.appendChild(spot)

  function createEnemy () {
    let enemyDiv = document.createElement('div')
    enemyDiv.classList.add('enemyClass')
    surroundingDiv.appendChild(enemyDiv)
    // Between 20 - 350
    let pixelSpan = Math.floor(Math.random() * (350 - 20) + 20)
    enemyDiv.style.top = pixelSpan + 'px'
    return enemyDiv
  }

  let enemyDiv = createEnemy()

  const downKey = 40
  const rightKey = 39
  const leftKey = 37
  const upKey = 38

  const pixelMove = 1

  let left = 0
  let top = 0

  function move (event) {
    console.log('Enemy top: ' + enemyDiv.style.top)
    console.log('Spot top: ' + spot.style.top)
    console.log('Enemy left: ' + enemyDiv.style.left)
    console.log('Spot left: ' + spot.style.left)
    if (event.keyCode === downKey) {
      top += pixelMove
      spot.style.top = (parseInt(top) + top) + 'px'
    } else if (event.keyCode === rightKey) {
      left += pixelMove
      spot.style.left = (parseInt(left) + left) + 'px'
    } else if (event.keyCode === leftKey) {
      left -= pixelMove
      spot.style.left = (parseInt(left) + left) + 'px'
    } else if (event.keyCode === upKey) {
      top -= pixelMove
      spot.style.top = (parseInt(top) + top) + 'px'
    } if (spot.style.top === enemyDiv.style.top || (spot.style.top - 1) === enemyDiv.style.top || (spot.style.top + 1) === enemyDiv.style.top) {
      console.log('REMOVED')
      enemyDiv.remove()

      createEnemy()
    }
  }
  document.onkeydown = move
}
