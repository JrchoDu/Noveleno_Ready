const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// POST create new news
router.post('/news', newsController.createNews);

// GET all news
router.get('/news', newsController.getAllNews);

// GET news by ID
router.get('/news/:id', newsController.getNewsById);

// PUT update news by ID
router.put('/news/:id', newsController.updateNews);

// DELETE news by ID
router.delete('/news/:id', newsController.deleteNews);

// GET all pending news (status = 0)
router.get('/pending', newsController.getPendingNews);

// PUT approve news by ID (set status to 1)
router.put('/approve/:id', newsController.approveNews);

module.exports = router;
