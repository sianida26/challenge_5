var express = require('express');
var router = express.Router();

const { Car } = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const cars = await Car.findAll({ order: [['id', 'ASC']]})
  res.render('index', { cars });
});

router.get('/editCar/:id', async function(req, res, next) {
  const car = await Car.findByPk(req.params.id);
  res.render('formCar', { isEdit: true, car });
});

router.get('/addCar', function(req, res, next){
  res.render('formCar', { isEdit: false, car: null });
});

module.exports = router;
