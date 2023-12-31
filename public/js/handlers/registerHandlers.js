const ENTER=13

function handleKeyUp(event) {
    event.preventDefault()
       if (event.keyCode === ENTER) {
          document.getElementById('registerButton').click()
      }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerButton').addEventListener('click', register)
    document.getElementById('loginButton').addEventListener('click', backToLogin)
    document.addEventListener('keyup', handleKeyUp)
})