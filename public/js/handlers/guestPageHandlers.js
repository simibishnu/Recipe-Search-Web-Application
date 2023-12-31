const ENTER=13

function handleKeyUp(event) {
    event.preventDefault()
       if (event.keyCode === ENTER) {
          document.getElementById('searchRecipeButton').click()
      }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('homeButton').addEventListener('click',backToHome)
    document.getElementById('searchRecipeButton').addEventListener('click',searchUpRecipe)
    document.getElementById('registerButton').addEventListener('click', backToRegister)
    document.getElementById('logOutButton').addEventListener('click',backToLogin)
    document.getElementById('categoryButton').addEventListener('click', getCategories)
    document.getElementById('reviewsButton').addEventListener('click', getUserReviews)
    document.getElementById('countryButton').addEventListener('click', getCountries)
    document.getElementById('likedRecipesButton').addEventListener('click', getLikedRecipes)
    document.addEventListener('keyup', handleKeyUp)
})