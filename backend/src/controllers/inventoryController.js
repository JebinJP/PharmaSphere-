const medicineModel = require('../models/medicineModel');
const csv = require('csv-parser');
const fs = require('fs');

const getAllMedicines = async (req, res) => {
    try {
        const medicines = await medicineModel.getAllMedicines();
        res.json(medicines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};

const getMedicine = async (req, res) => {
    try {
        const medicine = await medicineModel.getMedicineById(req.params.id);
        if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
        res.json(medicine);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch medicine' });
    }
};

const addMedicine = async (req, res) => {
    try {
        const newMedicine = await medicineModel.createMedicine(req.body);
        res.status(201).json(newMedicine);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add medicine' });
    }
};

const updateMedicine = async (req, res) => {
    try {
        const updated = await medicineModel.updateMedicine(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update medicine' });
    }
};

const deleteMedicine = async (req, res) => {
    try {
        await medicineModel.deleteMedicine(req.params.id);
        res.json({ message: 'Medicine deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete medicine' });
    }
};

const importInventory = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a CSV file' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                let count = 0;
                for (const item of results) {
                    // Map CSV fields to DB fields, handling potential discrepancies
                    const medicine = {
                        name: item.name || item.Name,
                        quantity: Number(item.quantity || item.Quantity || 0),
                        price: Number(item.price || item.Price || 0),
                        manufacturer: item.manufacturer || item.Manufacturer || null,
                        batch_number: item.batch_number || item.Batch || null,
                        expiration_date: item.expiration_date || item.Expiry || null,
                        description: item.description || item.Description || null
                    };

                    if (medicine.name) {
                        await medicineModel.createMedicine(medicine);
                        count++;
                    }
                }

                // Cleanup file
                fs.unlinkSync(req.file.path);

                res.status(201).json({ message: `Successfully imported ${count} items` });
            } catch (err) {
                console.error("Import Error:", err);
                res.status(500).json({ error: 'Failed to import inventory' });
            }
        });
};

module.exports = { getAllMedicines, getMedicine, addMedicine, updateMedicine, deleteMedicine, importInventory };
