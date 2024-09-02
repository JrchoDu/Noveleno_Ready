const express = require('express');
const {
  getAllMapData,
  createMapData,
  deleteMapData
} = require('../controllers/evacuationsController');

const router = express.Router();

router.get('/evacuation', getAllMapData);
router.post('/evacuation', createMapData);
router.delete('/evacuation/:id', deleteMapData);

module.exports = router;
