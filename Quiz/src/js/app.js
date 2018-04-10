'use strict'
let fetchClass = require('./fetch')

let startBtn = document.querySelector('#startBtn')
startBtn.addEventListener('click', event => {
  fetchClass.fetchQuestion('http://vhost3.lnu.se:20080/question/1')
  document.querySelector('#startTextInput').remove()
})

document.querySelector('#formId').addEventListener('submit', fetchClass.sendAnswer)
