'use strict'

let socket = io.connect('https://207.154.214.226/')

// Actions from github:
let newIssue = 'opened'
let deleteIssue = 'closed'
let commentOnIssue = 'created'
let deleteComment = 'deleted'
let reopenIssue = 'reopened'

socket.on('data', function (data) {
  if (data.action === newIssue || data.action === reopenIssue) {
    showNewIssue(data)
    notificationOptions(data)
  } else if (data.action === deleteIssue) {
    showDeleteIssue(data)
    notificationOptions(data)
  } else if (data.action === commentOnIssue) {
    showCommentOnIssue(data)
    showNewComment(data)
  } else if (data.action === deleteComment) {
    showDeleteComment(data)
  }
})

/**
 * This function updates an issue when deleting a comment on a issue
 * @param {*} data is the data from github
 */
function showCommentOnIssue (data) {
  let comment = document.querySelector('#comment' + data.issue.id)
  comment.textContent = (data.issue.comments + 1)
}

/**
 * This function updates an issue when deleting a comment on a issue
 * @param {*} data is the data from github
 */
function showDeleteComment (data) {
  let comment = document.querySelector('#comment' + data.issue.id)
  comment.textContent = (data.issue.comments - 1)
}

/**
 * This function deletes the div that contains the issue comment
 * @param {*} data is the data from github
 */
function showDeleteIssue (data) {
  document.querySelector('#_' + data.issue.id).remove()
}

/**
 * This function creates a notifiaction box thats shows whats happened with a issue within your repository,
 * like delete, create or reopen a issue
 * @param {*} data 
 */
function notificationOptions (data) {
  let newCommentTemplate = document.querySelector('#newCommentTemplate')
  let clone = document.importNode(newCommentTemplate.content, true)

  let commentTemplateDiv = clone.querySelector('.commentTemplateDiv')
  let titleDiv = clone.querySelector('.commentFrom')
  let profilePicDiv = clone.querySelector('.profilePic')
  commentTemplateDiv.classList.add('newComment')

  let profilePic = document.createElement('img')
  profilePic.src = data.issue.user.avatar_url
  profilePic.width = '70'
  profilePic.height = '70'

  let pText = document.createElement('p')
  let text

  if (data.action === deleteIssue) {
    text = document.createTextNode('The issue "' + data.issue.title + '" is deleted')
  } else if (data.action === newIssue) {
    text = document.createTextNode('The issue "' + data.issue.title + '" is created')
  } else if (data.action === reopenIssue) {
    text = document.createTextNode('The issue "' + data.issue.title + '" is reopen')
  }

  pText.appendChild(text)

  profilePicDiv.appendChild(profilePic)
  titleDiv.appendChild(text)

  commentTemplateDiv.appendChild(profilePicDiv)
  commentTemplateDiv.appendChild(titleDiv)

  document.querySelector('#popupDiv').appendChild(clone)
}

/**
 * If someone commented on an issue, this function will create a notification box on the page
 * that will contain the content, title of the issue and which user that commented
 * @param {*} data is the data from github
 */
function showNewComment (data) {
  let newCommentTemplate = document.querySelector('#newCommentTemplate')
  let clone = document.importNode(newCommentTemplate.content, true)

  let commentTemplateDiv = clone.querySelector('.commentTemplateDiv')
  let titleDiv = clone.querySelector('.commentFrom')
  let bodyDiv = clone.querySelector('.commentBody')
  let commentIssue = clone.querySelector('.commentIssue')
  let profilePicDiv = clone.querySelector('.profilePic')
  commentTemplateDiv.classList.add('newComment')

  let profilePic = document.createElement('img')
  profilePic.src = data.issue.user.avatar_url
  profilePic.width = '70'
  profilePic.height = '70'

  let pIssue = document.createElement('p')
  let pTitle = document.createElement('p')
  let pBody = document.createElement('p')

  let issueText = document.createTextNode('New comment on ' + data.issue.title)
  let userText = document.createTextNode('From: ' + data.comment.user.login)
  let bodyText = document.createTextNode(data.comment.body)

  pIssue.appendChild(issueText)
  pTitle.appendChild(userText)
  pBody.appendChild(bodyText)

  profilePicDiv.appendChild(profilePic)
  commentIssue.appendChild(issueText)
  titleDiv.appendChild(userText)
  bodyDiv.appendChild(bodyText)

  commentTemplateDiv.appendChild(profilePicDiv)
  commentTemplateDiv.appendChild(commentIssue)
  commentTemplateDiv.appendChild(titleDiv)
  commentTemplateDiv.appendChild(bodyDiv)

  document.querySelector('#popupDiv').appendChild(clone)
}

/**
 * If someone created an new issue or reopened an already existing issue, this function will create a new box on the page
 * that will contain title of the issue, the content, when it was created and how many comments the issue has.
 * @param {*} data is the data from github
 */
function showNewIssue (data) {
  let newIssueTemplate = document.querySelector('#newIssueTemplate')
  let clone = document.importNode(newIssueTemplate.content, true)

  let templateDiv = clone.querySelector('.templateDiv')
  templateDiv.id = '_' + data.issue.id
  templateDiv.classList.add('toTheLeft')

  let titleDiv = clone.querySelector('.titleOutput')
  let bodyDiv = clone.querySelector('.bodyOutput')
  let createdDiv = clone.querySelector('.createdOutput')
  let amoutCommentDiv = clone.querySelector('.commentAmountOutput')

  amoutCommentDiv.id = 'comment' + data.issue.id

  let pTitle = document.createElement('p')
  let pBody = document.createElement('p')
  let pCreated = document.createElement('p')
  let pAmountComment = document.createElement('p')

  let titleText = document.createTextNode(data.issue.title)
  let bodyText = document.createTextNode(data.issue.body)
  let createdText = document.createTextNode('Created at: ' + data.issue.created_at)
  let amountCommentText = document.createTextNode(data.issue.comments)

  pTitle.appendChild(titleText)
  pBody.appendChild(bodyText)
  pCreated.appendChild(createdText)
  pAmountComment.appendChild(amountCommentText)

  titleDiv.appendChild(titleText)
  bodyDiv.appendChild(bodyText)
  createdDiv.appendChild(createdText)
  amoutCommentDiv.appendChild(amountCommentText)

  document.querySelector('#issuesDiv').appendChild(clone)
}
