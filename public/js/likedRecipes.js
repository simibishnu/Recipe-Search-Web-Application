function getMealRecipe(event){
    let mealButton = event.target
    let mealName = mealButton.textContent
    window.location.href = `/meals?name=${mealName}`
}