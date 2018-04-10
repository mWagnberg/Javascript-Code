'use strict'
let video

module.exports = function (queryVideoDiv) {
  // Getting the template
  let videoTemplate = document.querySelector('#videoTemplate')
  let clone = document.importNode(videoTemplate.content, true)

  // Getting the video tag
  video = clone.querySelector('video')
  video.id = 'video'

  // URL object
  let urlObject = window.URL

  // Getting the canvas tag
  let canvas = clone.querySelector('canvas')
  canvas.id = 'canvas'
  let context = canvas.getContext('2d')

  // Getting the select tag containing all the filter options
  let filterTemplate = document.querySelector('#filterTemplate')
  let filterClone = document.importNode(filterTemplate.content, true)
  let filterList = filterClone.querySelector('select')
  filterList.id = 'filterList'
  filterClone.querySelectorAll('option')

  queryVideoDiv.appendChild(clone)

  // Create a div and place the select tag within
  let betweenImageDiv = document.createElement('div')
  betweenImageDiv.id = 'betweenImage'
  queryVideoDiv.appendChild(betweenImageDiv)
  let queryBetweenImageDiv = document.querySelector('#betweenImage')

  queryBetweenImageDiv.appendChild(filterClone)

  /* By MDN this getUserMedia is deprecated, but it still works for now
     But this is for ask the user for permission to open like camera and/or mic */
  navigator.getMedia = navigator.getUserMedia

  // Set video to true and then stream it the video tag
  navigator.getMedia({
    video: true,
    audio: false
  }, function (stream) {
    video.src = urlObject.createObjectURL(stream)
    video.play()

    // Getting the window close button and if clicked; the stream will stop and close the application
    let closeButton = document.querySelector('#videoCloseButton')
    closeButton.addEventListener('click', event => {
      let stopStream = stream.getTracks()[0]
      stopStream.stop()
      queryVideoDiv.remove()
    })
  }, function (error) {
    console.log(error)
  })

  // Create an image tag to place the token picture
  let image = document.createElement('img')
  image.id = 'image'
  image.classList.add('videoImageClass')
  image.src = '../image/defaultImage.png'
  queryVideoDiv.appendChild(image)

  let saveButton = document.createElement('a')

  // This button will take a picture from the stream
  let videoButton = document.querySelector('.videoButton')
  videoButton.classList.add('videoButton')
  videoButton.addEventListener('click', event => {
    document.querySelector('#videoDiv').appendChild(image)

    // Get the choosen filter thate has been selected before taken the picture and place that filter on the image
    let queryFilterList = document.querySelector('#filterList')
    let filterStyle = queryFilterList.value
    image.style.filter = filterStyle
    context.filter = filterStyle
    canvas.style.filter = filterStyle

    context.drawImage(video, 0, 0, 400, 300)
    image.src = canvas.toDataURL('image/png')

    // This button is for saving the tooken picture the computer
    saveButton.textContent = 'Save Image'
    saveButton.classList.add('saveImageButton')
    document.querySelector('.videoClass').appendChild(saveButton)
    saveButton.addEventListener('click', event => {
      saveButton.href = canvas.toDataURL('image/png')
      saveButton.download = 'ImagePhoto'
    })
  })
}
