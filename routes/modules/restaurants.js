const express = require('express')
const router = express.Router()
const Restaurants = require('../../models/restaurant')

//search
router.get('/search', (req , res) => {
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
router.get('/new' , (req , res) => {
    res.render('new')
})

//detail
router.get('/:id', (req ,res) => {
    const id = req.params.id
    return Restaurants.findById(id)
      .lean()
      .then( restaurant => res.render('detail', { restaurant }))
      .catch(error => console.log(error))
})

//new : 增加餐廳
router.post('/' , (req ,res) => {
    const { name , name_en , category , image , location , phone , google_map , rating , description } = req.body
    if(!name || !image || !category || !location || !phone || !google_map ||!rating || !description) {
        return res.redirect('/restaurants/new')
    }

    return Restaurants.create({name , name_en , category , image , location , phone , google_map , rating , description})
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
})

//edit
router.get('/:id/edit', (req , res) => {
    const id = req.params.id
    return Restaurants.findById(id)
      .lean()
      .then(restaurant => res.render('edit', { restaurant }))
      .catch(error => console.log(error))
})

//edit : 修改資料
router.put('/:id', (req , res) => {
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
router.delete('/:id' ,(req , res) => {
    const id = req.params.id
    return Restaurants.findById(id)
      .then(restaurant => restaurant.remove())
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
})

module.exports = router