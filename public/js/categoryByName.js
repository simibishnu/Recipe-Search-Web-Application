function getMealRecipe(event){
    let mealButton = event.target
    let mealName = mealButton.getAttribute('alt').split(' ').join('_')
    window.location.href = `/meals?name=${mealName}`
}