var express = require('express');
var router = express.Router();
var multer = require('multer');

const { Car } = require('../models');

// file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './storage/images'),
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}${Math.floor(Math.random()*1E6)}.${file.originalname.split('.').pop()}`; //random filename
    cb(null, fileName)
  }
})

// multer configuration for file upload
const upload = multer({ storage: storage })

/* get cars. */
router.get('/cars', async (req, res) => {
  const cars = await Car.findAll();
  res.json(cars);
});

/* create car. */
router.post('/cars', upload.single('photo'), async (req, res, next) => {
  const { name, price, size } = req.body;
  const filename = req.file.filename;
  try {
    const car = await Car.create({ name, price, size, filename });
    res.status(201).json({
      message: 'Data berhasil disimpan',
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Failed to add car',
    });
    console.log(err);
  }
});

/* update car. */
router.put('/cars', upload.single('photo'), async (req, res, next) => {
  try {
    const car = await Car.findByPk(req.body.id);
    const { name, price, size } = req.body;
    const filename = req.file ? req.file.filename : car.filename;
    await car.update({ name, price, size, filename });
    res.status(200).json({
      message: 'Data berhasil disimpan',
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Failed to update car',
    });
    console.log(err);
  }
});

router.delete('/cars', async (req, res, next) => {
  try {
    const car = await Car.findByPk(req.body.id);
    console.log(req.body)
    await car.destroy();
    res.status(200).json({
      message: 'Data berhasil dihapus',
    });
  }
  catch (err) {
    res.status(500).json({
      message: 'Failed to delete car',
    });
    console.log(err);
  }
});

module.exports = router;
