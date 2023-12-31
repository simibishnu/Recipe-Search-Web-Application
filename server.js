var http = require('http')
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var sessions = require('express-session')
var routes = require('./routes/index')
var app = express()
const PORT = process.env.PORT || 3000
const oneDay = 1000 * 60 * 60 * 24;

app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'hbs')

app.locals.pretty = true

//i got this code for creating a session with express and nodejs from this site: https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/
app.use(
    sessions({
    secret: "asdkfjwsecretkeyaeijsdnfksldjf",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false,
}))

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.use(cookieParser())


app.get('/homepage', routes.homepage)
app.get(['/','/login'], routes.login)
app.post(['/','/login'], routes.loginUser)
app.get('/register', routes.register)
app.post('/register', routes.registerUser)
app.get('/viewUsers', routes.viewUsers)

app.get('/meals', routes.meals)
app.post('/meals/addReview', routes.addReview)
app.post('/meals/addLike', routes.addLike)

app.get('/categories', routes.categories)
app.get('/getCategory',routes.getCategory)

app.get('/countries', routes.countries)
app.get('/getCountry', routes.getCountry)

app.get('/likedRecipes', routes.likedRecipes)

app.get('/recipes', routes.recipes)
app.get('/reviews', routes.showUserReviews)

app.get('/logout', routes.logout)

app.listen(PORT, err => {
    if(err) console.log(err)
    else {
          console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
          console.log(`To Test:`)
          console.log('http://localhost:3000/login')
      }
  })

