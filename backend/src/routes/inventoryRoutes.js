const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticate, authorize } = require('../utils/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', authenticate, inventoryController.getAllMedicines);
router.get('/:id', authenticate, inventoryController.getMedicine);
router.post('/', authenticate, authorize(['ADMIN']), inventoryController.addMedicine);
router.put('/:id', authenticate, authorize(['ADMIN']), inventoryController.updateMedicine);
router.delete('/:id', authenticate, authorize(['ADMIN']), inventoryController.deleteMedicine);
router.post('/import', authenticate, authorize(['ADMIN']), upload.single('file'), inventoryController.importInventory);

module.exports = router;
