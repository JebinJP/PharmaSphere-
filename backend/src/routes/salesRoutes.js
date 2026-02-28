const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { authenticate, authorize } = require('../utils/authMiddleware');
const upload = require('../config/multerConfig');

router.post('/', authenticate, salesController.recordSale);
router.get('/', authenticate, salesController.getSalesHistory);
router.get('/forecast/:medicineId', authenticate, salesController.getForecast);
router.post('/import', authenticate, authorize(['ADMIN']), upload.single('salesCsv'), salesController.importSalesData);

module.exports = router;
