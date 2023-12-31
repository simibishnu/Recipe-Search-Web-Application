
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('logOutButton').addEventListener('click', backToLogin)
    document.getElementById('registerButton').addEventListener('click', backToRegister)
    document.getElementById('homeButton').addEventListener('click', backToHome)
    
    const categoryButtons = document.getElementsByClassName('categoryButton')
    console.log(categoryButtons)
    
    for(let i=0; i<categoryButtons.length; ++i){
        categoryButtons.item(i).addEventListener('click',getCategoryByName)
    }

})