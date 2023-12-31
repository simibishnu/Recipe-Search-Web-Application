document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('logOutButton').addEventListener('click', backToLogin)
    document.getElementById('registerButton').addEventListener('click', backToRegister)
    document.getElementById('homeButton').addEventListener('click', backToHome)

    let mealButtons = document.getElementsByClassName('mealButton')

    for(let i=0; i<mealButtons.length; ++i){
        mealButtons.item(i).addEventListener('click',getMealRecipe)
    }

})