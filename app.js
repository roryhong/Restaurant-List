const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const Restaurants = require('./models/restaurant')
const routes = require('./routes')
const port = 3000
const app = express()

//執行mongoose
require('./config/mongoose')

app.engine('hbs', exphbs({defaultLayout : 'main', extname : '.hbs'}))
app.set('view engine','hbs')

app.use(express.static('public'))
app.use(express.urlencoded( { extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

//search
app.get('/search', (req , res) => {
    const keyword = req.query.keyword.trim().toLowerCase()
    Restaurants.find()
      .lean()
      .then( restaurants => {
          if(keyword) {
              restaurants = restaurants.filter( restaurant => 
                  restaurant.name.toLowerCase().includes(keyword) ||
                  restaurant.category.includes(keyword)
              )
          }
          
          if (restaurants.length === 0) {
             const error = '很抱歉，找不到搜尋結果'
             return res.render('index' , { error })
          }
          res.render('index', { restaurant : restaurants})
      })
      .catch(error => console.log(error))
})

//new頁面
app.get('/restaurant/new' , (req , res) => {
    res.render('new')
})


app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})