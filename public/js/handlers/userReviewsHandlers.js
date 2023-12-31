document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('homeButton').addEventListener('click',backToHome)
    document.getElementById('registerButton').addEventListener('click', backToRegister)
    document.getElementById('logOutButton').addEventListener('click',backToLogin)

    let mealButtons = document.getElementsByClassName('mealButton')

    for(let i=0; i<mealButtons.length; ++i){
        mealButtons.item(i).addEventListener('click',getMealRecipe)
    }
})