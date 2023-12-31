function getCategoryByName(event){
    let categoryButton = event.target
    let categoryName = categoryButton.innerText

    window.location.href = `/getCategory?categoryName=${categoryName}`

}