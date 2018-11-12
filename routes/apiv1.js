var express = require('express')
var router = express.Router()

var Controller=require('./../controllers/ApiController');
// define the home page route
router.get('/filter', function (req, res) {
  Controller.filter().then(function(result){
  	res.json(result)
  }).catch(function (error) {
  	res.send(error)
  })
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router