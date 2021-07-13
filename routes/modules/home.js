const express = require('express')
const router = express.Router()
const Restaurants = require('../../models/restaurant')

//index
router.get('/', (req, res) => {
    Restaurants.find()
      .lean()
      .then(restaurant => res.render('index', { restaurant }))
      .catch(error => console.log(error))
})

module.exports = router