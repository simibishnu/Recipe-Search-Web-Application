function viewUsers(){
    window.location.href = "/viewUsers"
}

function searchUpRecipe(){
    console.log('recipe search attempt')
    let mealName = document.getElementById('searchRecipeBar').value
    if(mealName === ''){
        return alert('Please enter a meal')
    }

    window.location.href = `/recipes?search=${mealName}`
    
}