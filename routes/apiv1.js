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


router.post('/search',function(req,res){
	
	Controller.search(req.body.search_query,req.body.filters).then(function(result){
		res.send(result)
	}).catch(function(error){
		res.send(error)
	})
})




module.exports = router