var https = require('https')
var url = require('url');
var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database('data/finalproject');

db.serialize(function(){
    var userTableQuery = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT, role TEXT)";
    db.run(userTableQuery);
    addAdminString = "INSERT OR REPLACE INTO users VALUES ('admin', 'admin', 'admin')";
    db.run(addAdminString);
    var mealTableQuery = "CREATE TABLE IF NOT EXISTS meals (mealid TEXT PRIMARY KEY)";
    db.run(mealTableQuery)

    var reviewTableQuery = `CREATE TABLE IF NOT EXISTS reviews (
        reviewid INTEGER PRIMARY KEY AUTOINCREMENT,
        review TEXT,
        userid TEXT,
        mealid TEXT,
        rating INTEGER DEFAULT 0,
        FOREIGN KEY(userid) REFERENCES users(userid),
        FOREIGN KEY(mealid) REFERENCES meals(mealid))`

    db.run(reviewTableQuery)

    var likedMealsTableQuery = `CREATE TABLE IF NOT EXISTS likes(
        likeid INTEGER PRIMARY KEY AUTOINCREMENT,
        userid TEXT,
        mealid TEXT,
        FOREIGN KEY(userid) REFERENCES users(userid),
        FOREIGN KEY(mealid) REFERENCES meals(mealid))`
    
    db.run(likedMealsTableQuery)

})

exports.login = function(request, response){
    response.render('login', {title: 'Login'})
}

exports.logout = function(request, response){
    request.session.destroy(function(err){
        if(err){
            console.log(err.message)
        }
        else{
            response.redirect('/login')
        }
    })
}

exports.register = function(request, response){
    response.render('register', {title: 'Register'})
}

exports.loginUser = function(request, response){
    let username = request.body.username;
    let password = request.body.password;

    db.get('SELECT * FROM users WHERE userid=? AND password=?', [username, password], (err,row)=>{
        if(err){
            console.log(err.message)
        }
        if(row){
            request.session.userid = username
            request.session.role = row.role
            response.status(200).json({redirect: '/homepage' });
        }
        else{
            response.status(401).json({ error: 'Invalid username or password' });
        }
    })
}

exports.registerUser = function(request,response){
    let username = request.body.username
    let password = request.body.password

    db.get('SELECT * FROM users WHERE userid=?',[username], (err, row)=>{
        if(!row){
            let addUser = "INSERT INTO users VALUES (?, ?, ?)"
            db.run(addUser, [username, password, 'guest'], (err)=>{
                if(err){
                    console.log(err.message)
                }
                else{
                    request.session.userid = username
                    request.session.role = 'guest'
                    response.status(200).json({redirect: '/login' })
                }
            })
        }
        else{
            response.status(401).json({error: 'This username is not available. Try again.' })
            console.log('this username is already taken')
        }
    })

}

exports.homepage = function(request, response){
    if(!request.session.userid){
        return response.redirect('/login')
    }

    if(request.session.role === 'admin'){
        
        response.render('adminHomePage', {title:'admin homepage', username: request.session.userid})
    }
    
    if(request.session.role === 'guest'){
        
        response.render('guestHomepage', {title: 'guest homepage', username: request.session.userid})
    }
}

exports.viewUsers = function(request, response){
    
    if(!request.session.userid && !request.session.role){
        return response.redirect('/login')
    }

    if(request.session.role === 'admin'){
        let users = []
        db.all("SELECT userid FROM users", function(err, rows) {
            for(let row of rows){
                
                
                users.push({username: row.userid})
            }
            
            response.render('viewUsers', {title: 'Users', users: users})
        })
        
    }
}

exports.meals = function(request, response){

    if(!request.session.userid && !request.session.role){
        return response.redirect('/login')
    }

    let recipeName = request.query.name.split(' ').join('_')

    let options = {
        "method": "GET",
        "hostname": "themealdb.com",
        "port": null,
        "path": `/api/json/v1/1/search.php?s=${recipeName}`,
        "headers": {
          "userQueryString": true
        }
    }

    
    https.request(options, function(apiResponse) {
        let recipeData = ''
        apiResponse.on('data', function(chunk) {
          recipeData += chunk
          
        })
        apiResponse.on('end', function() {
           
           let result = JSON.parse(recipeData)
           let recipe = result.meals[0]

           let ingredients = []
           let measure = []
           for(const[key, value] of Object.entries(recipe)){
                if(key.includes("strIngredient")&& value){
                    ingredients.push(value)
                }
                if(key.includes("strMeasure")&& value){
                    measure.push(value)
                }
           }

           let ingredientStrings = []

           for(let i=0; i<ingredients.length; ++i){
                ingredientStrings.push({ingredient: `${measure[i]} ${ingredients[i]}`})
           }


           let instructions = []

           let recipeInstructions = recipe.strInstructions.split('\r\n').map(instruction=>{
                return instruction.replace(/^\d+\.\s*|\d+\s*/, '').trim()
           }).filter(instruction => instruction.trim())

           for(let i=0; i<recipeInstructions.length; ++i){
                
                instructions.push({instruction: recipeInstructions[i]})
                
           }

           var addMeal = 'INSERT or IGNORE INTO meals VALUES (?)'

           db.run(addMeal, [recipe.strMeal], function(err){
                if(err){
                    console.log(err.message)
                }
           })

           let reviews = []

           db.all('SELECT * FROM reviews WHERE mealid=?', [recipe.strMeal], (err,rows)=>{
                if(err){
                    console.log(err.message)
                }
            
                if(rows.length>0){
                    for(let row of rows){
                        reviews.push({username: row.userid, review: row.review})
                    }
                    
                }
            })

            let liked = false;
            db.get('SELECT * FROM likes WHERE userid=? AND mealid=?', [request.session.userid, recipe.strMeal], (err,row)=>{
                if(row){
                    liked = true
                    
                }
                response.render('meal',{title:`${recipe.strMeal}`, image: `${recipe.strMealThumb}`, instructions:instructions, ingredients: ingredientStrings, reviews: reviews, liked: liked})
            })
           
        })
      }).end() 
}

exports.addReview = function(request, response){
    if(!request.session.userid){
        return response.redirect('/login')
    }

    let review = request.body.review
    let mealName = request.body.mealName
    let userName = request.session.userid

    let addReviewQuery =  `INSERT INTO reviews (review, userid, mealid) VALUES (?, ?, ?)`
    db.run(addReviewQuery, [review, userName, mealName], function(err){
        if(err){
            console.log(err.message)
        }
    })

    response.render('review', {username: userName, review: review})

}

exports.addLike = function(request, response){
    let mealName = request.body.mealName
    let userName = request.session.userid

    db.get('SELECT * FROM likes WHERE userid=? AND mealid=?', [userName, mealName], (err,row)=>{
        if(!row){
            let addLikeQuery = "INSERT INTO likes (userid, mealid) VALUES (?, ?)"
            db.run(addLikeQuery, [userName, mealName], (err)=>{
                if(err){
                    console.log(err.message)
                }
                else{
                    response.send({liked:true})
                }
            })
        }
        else{
            let delLikeQuery = "DELETE FROM likes WHERE userid=? AND mealid=?"
            db.run(delLikeQuery, [userName, mealName], (err)=>{
                if(err){
                    console.log(err.message)
                }
                else{
                    response.send({liked:false})
                }
            })
        }
    
    })

    

}

exports.recipes = function(request, response){
    if(!request.session.userid){
        return response.redirect('/login')
    }

    let mealName = request.query.search.split(' ').join('_')

    
    if(!mealName){
        response.json({message: 'Please enter a meal you want to search up'})
        return
    }
    
    let options = {
        "method": "GET",
        "hostname": "themealdb.com",
        "port": null,
        "path": `/api/json/v1/1/search.php?s=${mealName}`,
        "headers": {
          "userQueryString": true
        }
    }

    https.request(options, function(apiResponse) {
        let mealData = ''
        apiResponse.on('data', function(chunk) {
          mealData += chunk
        })
        apiResponse.on('end', function() {
            let result = JSON.parse(mealData)
            let count = 0;
            let mealArray = result.meals
            
            if(mealArray){
                count = mealArray.length
            }

            response.render('categoryByName', {title: `Results for: ${request.query.search}`, meals: mealArray, count: count})
            
        })
    }).end()
}

exports.categories = function(request, response){
    if(!request.session.userid && !request.session.role){
        return response.redirect('/login')
    }

    let options = {
        "method": "GET",
        "hostname": "themealdb.com",
        "port": null,
        "path": `/api/json/v1/1/categories.php`,
        "headers": {
          "userQueryString": true
        }
    }
    
    https.request(options, function(apiResponse) {
        let categoriesData = ''
        apiResponse.on('data', function(chunk) {
          categoriesData += chunk
        })
        apiResponse.on('end', function() {
            let result = JSON.parse(categoriesData)
            response.render('categories', {title: 'Recipes by Category', categories: result.categories})
        })
    }).end()

}

exports.countries = function(request, response){
    if(!request.session.userid){
        return response.redirect('/login')
    }
    let options = {
        "method": "GET",
        "hostname": "themealdb.com",
        "port": null,
        "path": `/api/json/v1/1/list.php?a=list`,
        "headers": {
          "userQueryString": true
        }
    }
    https.request(options, function(apiResponse) {
        let countriesData = ''
        apiResponse.on('data', function(chunk) {
          countriesData += chunk
        })
        apiResponse.on('end', function() {
            let result = JSON.parse(countriesData)
            response.render('countries', {title: 'Recipes by Country', countries: result.meals})
        })
    }).end()
}

exports.getCategory = function(request, response){
    if(!request.session.userid){
        return response.redirect('/login')
    }

    let categoryName = request.query.categoryName

    let options = {
        "method": "GET",
        "hostname": "themealdb.com",
        "port": null,
        "path": `/api/json/v1/1/filter.php?c=${categoryName}`,
        "headers": {
          "userQueryString": true
        }
    }

    https.request(options, function(apiResponse) {
        let mealData = ''
        apiResponse.on('data', function(chunk) {
          mealData += chunk
        })
        apiResponse.on('end', function() {
            let result = JSON.parse(mealData)
            let count = result.meals.length
            response.render('categoryByName', {title: `Meal Category: ${categoryName}`, meals: result.meals, count:count})
        })
      }).end()
}

exports.getCountry = function(request, response){
    if(!request.session.userid){
        response.redirect('/login')
    }

    let countryName = request.query.countryName
    let options = {
        "method": "GET",
        "hostname": "themealdb.com",
        "port": null,
        "path": `/api/json/v1/1/filter.php?a=${countryName}`,
        "headers": {
          "userQueryString": true
        }
    }

    https.request(options, function(apiResponse) {
        let mealData = ''
        apiResponse.on('data', function(chunk) {
          mealData += chunk
        })
        apiResponse.on('end', function() {
            let result = JSON.parse(mealData)
            let count = result.meals.length
            response.render('categoryByName', {title: `Meal Category: ${countryName}`, meals: result.meals, count: count})
        })
      }).end()
}

exports.likedRecipes = function(request, response){

    if(!request.session.userid){
        response.redirect('/login')
    }

    let likedRecipes = []
    let empty = false
    let getLikedRecipesQuery = 'SELECT * FROM likes WHERE userid=?'
    db.all(getLikedRecipesQuery, [request.session.userid], (err,rows)=>{
        if(err){
            console.log(err.message)
        }
        
        if(rows.length>0){
            for(let row of rows){
                likedRecipes.push({mealName: row.mealid})
            }
        }
        else{
            empty = true
        }
        response.render('likedRecipes', {header: `${request.session.userid}'s liked recipes:`, recipes: likedRecipes, empty: empty})
    })
}

exports.showUserReviews = function(request, response){
    if(!request.session.userid){
        return response.redirect('/login')
    }

    let userReviews = []
    let empty = false

    db.all('SELECT * FROM reviews WHERE userid=?', [request.session.userid], (err,rows)=>{
        if(err){
            console.log(err.message)
        }
        
        if(rows.length>0){
            for(let row of rows){
                userReviews.push({username: row.userid, review: row.review, meal: row.mealid})
            }
        }
        else{
            empty = true
        }
        response.render('userReviews', {header: `${request.session.userid}'s Reviews`, empty: empty, reviews: userReviews})
    })

}