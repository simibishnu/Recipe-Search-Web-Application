const ENTER=13

function handleKeyUp(event) {
    event.preventDefault()
       if (event.keyCode === ENTER) {
          document.getElementById('addReviewButton').click()
      }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('homeButton').addEventListener('click',backToHome)
    document.getElementById('registerButton').addEventListener('click', backToRegister)
    document.getElementById('logOutButton').addEventListener('click',backToLogin)
    document.getElementById('addReviewButton').addEventListener('click', addReview)
    document.getElementById('likeButton').addEventListener('click', like)
    document.addEventListener('keyup', handleKeyUp)
})