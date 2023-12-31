function searchUpRecipe(){
    console.log('recipe search attempt')
    let mealName = document.getElementById('searchRecipeBar').value
    if(mealName === ''){
        return alert('Please enter a meal')
    }

    window.location.href = `/recipes?search=${mealName}`
    
}

function getUserReviews(){
    window.location.href = `/reviews`
}

function getCategories(){
    window.location.href = '/categories'
}

function getCountries(){
    window.location.href = '/countries'
}

function getLikedRecipes(){
    window.location.href = '/likedRecipes'
}