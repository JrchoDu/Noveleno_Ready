const express = require('express');
const {
  getAllMapData,
  createMapData,
  deleteMapData
} = require('../controllers/mapDataController');

const router = express.Router();

router.get('/mapdata', getAllMapData);
router.post('/mapdata', createMapData);
router.delete('/mapdata/:id', deleteMapData);

module.exports = router;
