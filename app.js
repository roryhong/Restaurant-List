const express = require('express')
const exphbs = require('express-handlebars')
const restaurants = require('./restaurant.json')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({defaultLayout : 'main'}))
app.set('view engine','handlebars')
app.use(express.static('public'))

//index
app.get('/', (req, res) => {
    res.render('index', {restaurant : restaurants.results})
})

//show
app.get('/restaurants/:restaurant_id', (req ,res) => {
    const id = restaurants.results.find( restaurant => restaurant.id.toString() === req.params.restaurant_id)
    res.render('show', {restaurant : id})
})

//search
app.get('/search', (req , res) => {
    const keyword = req.query.keyword
    const findRestaurant = restaurants.results.filter( restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render('index', {restaurant : findRestaurant , keyword : keyword})
})

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})