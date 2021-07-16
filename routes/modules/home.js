const express = require('express')
const router = express.Router()
const Restaurants = require('../../models/restaurant')
const sortData = require('../../config/sort.json')

//index
router.get('/', (req, res) => {
    Restaurants.find()
      .lean()
      .sort({_id : 'asc'})
      .then(restaurant => res.render('index', { restaurant , sortData}))
      .catch(error => console.log(error))
})

module.exports = router