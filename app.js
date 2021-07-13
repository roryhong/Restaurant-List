const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Restaurants = require('./models/restaurant')
const port = 3000
const app = express()

const db = mongoose.connection
mongoose.connect('mongodb://localhost/restaurant-list' , { useNewUrlParser: true, useUnifiedTopology: true })

app.engine('hbs', exphbs({defaultLayout : 'main', extname : '.hbs'}))
app.set('view engine','hbs')
app.use(express.static('public'))
app.use(express.urlencoded( { extended: true }))
app.use(methodOverride('_method'))

db.on('error', () => {
    console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
})


//index
app.get('/', (req, res) => {
    Restaurants.find()
      .lean()
      .then(restaurant => res.render('index', { restaurant }))
      .catch(error => console.log(error))
})

//detail
app.get('/restaurants/:id', (req ,res) => {
    const id = req.params.id
    return Restaurants.findById(id)
      .lean()
      .then( restaurant => res.render('detail', { restaurant }))
      .catch(error => console.log(error))
})

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

//new : 增加餐廳
app.post('/restaurants' , (req ,res) => {
    const { name , name_en , category , image , location , phone , google_map , rating , description } = req.body
    if(!name || !image || !category || !location || !phone || !google_map ||!rating || !description) {
        return res.redirect('/restaurants/new')
    }

    return Restaurants.create({name , name_en , category , image , location , phone , google_map , rating , description})
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
})

//edit
app.get('/restaurants/:id/edit', (req , res) => {
    const id = req.params.id
    return Restaurants.findById(id)
      .lean()
      .then(restaurant => res.render('edit', { restaurant }))
      .catch(error => console.log(error))
})

//edit : 修改資料
app.put('/restaurants/:id', (req , res) => {
    const { name , name_en , category , image , location , phone , google_map , rating , description } = req.body
    const id = req.params.id
    return Restaurants.findById(id)
     .then( restaurant => {
        restaurant.name = name
        restaurant.name_en = name_en
        restaurant.category = category
        restaurant.image = image
        restaurant.location = location
        restaurant.phone = phone
        restaurant.google_map = google_map
        restaurant.rating = rating
        restaurant.description = description
        return restaurant.save()
     })
     .then(() => res.redirect(`/restaurants/${id}`))
     .catch(error => console.log(error))
})

//delete
app.delete('/restaurants/:id' ,(req , res) => {
    const id = req.params.id
    return Restaurants.findById(id)
      .then(restaurant => restaurant.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
})

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})