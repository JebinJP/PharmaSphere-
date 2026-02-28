const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const upload = require('../config/multerConfig');
const { authenticate } = require('../utils/authMiddleware');

router.post('/upload', authenticate, upload.single('prescriptionImage'), prescriptionController.uploadPrescription);
router.get('/', authenticate, prescriptionController.getPrescriptions);
router.get('/:id', authenticate, prescriptionController.getPrescription);

module.exports = router;
