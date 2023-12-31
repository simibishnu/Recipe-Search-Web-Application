

function login(){

    let username = document.getElementById("loginUserName").value
    let password = document.getElementById("loginPassword").value

    if(username===""){
        return alert('Enter your user name')
    }
    if(password===""){
        return alert('Enter your password')
    }

    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/login", true)
    xhr.setRequestHeader("Content-Type","application/json")

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                var successResponse = JSON.parse(xhr.responseText);
                console.log("go to homepage");
                window.location.href = successResponse.redirect;
            } else if (xhr.status == 401) {
                var errorResponse = JSON.parse(xhr.responseText);
                alert(errorResponse.error);
            } else {
                alert('An error occurred. Please try again later.');
            }
        }
    };
    let data = JSON.stringify({username: username, password: password})
    xhr.send(data)
}


