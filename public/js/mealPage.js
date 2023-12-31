function addReview(){
    let review = document.getElementById('reviewInputBar').value
    let mealName = document.getElementById('mealName').textContent

    if(review===""){
        return alert('submit a review')
    }
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/meals/addReview", true)
    xhr.setRequestHeader("Content-Type","application/json")

    xhr.onreadystatechange = function(){
        if(xhr.readyState ==4){
         if(xhr.status == 200){
             document.getElementById('reviews-box').innerHTML+=xhr.responseText
             document.getElementById('reviewInputBar').value = '';
         }
        }
     }
     let data = JSON.stringify({review: review, mealName: mealName})
     xhr.send(data)

}

function like(){
    let mealName = document.getElementById('mealName').textContent
    let likeButton = document.getElementById('likeButton')
    var xhr = new XMLHttpRequest()
    
    xhr.open("POST", "/meals/addLike", true)
    xhr.setRequestHeader("Content-Type","application/json")

    xhr.onreadystatechange = function(){
        if(xhr.readyState ==4){
         if(xhr.status == 200){
            let result = JSON.parse(xhr.responseText)
            let liked = result.liked
            if(liked){
                console.log('this user liked this meal')
                likeButton.classList.add('filled')
            }
            else{
                console.log('this user unliked this meal')
                likeButton.classList.remove('filled')
            }
         }
        }
     }
     let data = JSON.stringify({mealName: mealName})
     xhr.send(data)

}