const express = require('express');
const { getChecklist, saveChecklist } = require('../controllers/checklistController'); 
const router = express.Router();

router.get('/checklist', getChecklist);
router.post('/checklist', saveChecklist);

module.exports = router;
