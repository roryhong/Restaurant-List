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

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})