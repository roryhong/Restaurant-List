const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const data = require('./restaurant.json') 
const list = data.results

mongoose.connect('mongodb://localhost/restaurant-list' , { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
    console.log('mongoose error!')
})

db.once('open', () => {
    console.log('mongoose connection!')
    //建立資料
   list.forEach(restaurant => {
        Restaurant.create({
            id: restaurant.id,
            name: restaurant.name,
            name_en: restaurant.name_en,
            category: restaurant.category,
            image: restaurant.image,
            location: restaurant.location,
            phone: restaurant.phone,
            google_map: restaurant.google_map,
            rating: restaurant.rating,
            description: restaurant.description
        })
    })
    console.log('done')
})