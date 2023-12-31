const ENTER=13

function handleKeyUp(event) {
    event.preventDefault()
       if (event.keyCode === ENTER) {
          document.getElementById('loginButton').click()
      }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginButton').addEventListener('click', login)
    document.getElementById('registerButton').addEventListener('click',backToRegister)
    document.addEventListener('keyup', handleKeyUp)
})