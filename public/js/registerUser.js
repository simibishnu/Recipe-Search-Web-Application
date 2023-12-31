function register(){
    let username = document.getElementById('registerUserName').value
    let password = document.getElementById('registerPassword').value

    if(username===""){
        return alert('Enter a user name')
    }
    if(password===""){
        return alert('Enter a password')
    }

    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/register", true)
    xhr.setRequestHeader("Content-Type","application/json")

    xhr.onreadystatechange = function(){
        if(xhr.readyState ==4){
         if(xhr.status == 200){
            var successResponse = JSON.parse(xhr.responseText);
            window.location.href = successResponse.redirect;
         }
         else if(xhr.status==401){
            var errorResponse = JSON.parse(xhr.responseText);
            alert(errorResponse.error);
         }
         else{
            alert('An error occurred. Please try again later.');
         }
        }
     }
     let data = JSON.stringify({username: username, password: password})
     xhr.send(data)
}