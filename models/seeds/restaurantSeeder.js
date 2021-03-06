const Restaurant = require('../restaurant')
const data = require('./restaurant.json') 
const list = data.results
const db = require('../../config/mongoose')

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