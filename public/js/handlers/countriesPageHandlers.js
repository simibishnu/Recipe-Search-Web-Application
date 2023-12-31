document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('logOutButton').addEventListener('click', backToLogin)
    document.getElementById('registerButton').addEventListener('click', backToRegister)
    document.getElementById('homeButton').addEventListener('click', backToHome)
    
    const countryButtons = document.getElementsByClassName('countryButton')
    
    for(let i=0; i<countryButtons.length; ++i){
        countryButtons.item(i).addEventListener('click',getCountryByName)
    }

})