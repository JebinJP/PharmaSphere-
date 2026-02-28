const salesModel = require('../models/salesModel');
const forecastingService = require('../services/forecastingService');
const medicineModel = require('../models/medicineModel');
const fs = require('fs');
const csv = require('csv-parser');

const recordSale = async (req, res) => {
    const { medicineId, quantity, pricePerUnit } = req.body;

    try {
        const medicine = await medicineModel.getMedicineById(medicineId);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        if (medicine.quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Use custom price if provided, otherwise default to medicine price
        const finalPrice = pricePerUnit !== undefined ? pricePerUnit : medicine.price;
        const totalPrice = finalPrice * quantity;

        // 1. Record Sale
        const sale = await salesModel.addSale(medicineId, quantity, totalPrice);

        // 2. Update Inventory
        await medicineModel.updateMedicine(medicineId, {
            ...medicine,
            quantity: medicine.quantity - quantity
        });

        res.status(201).json(sale);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to record sale' });
    }
};

const getSalesHistory = async (req, res) => {
    try {
        const history = await salesModel.getAllSales();
        res.json(history);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch sales history' });
    }
};

const getForecast = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const dailySales = await salesModel.getDailySalesForMedicine(medicineId);

        const prediction = forecastingService.predictDemand(dailySales);
        res.json(prediction);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to generate forecast' });
    }
};

// Ingest Historic Data
const importSalesData = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No CSV file uploaded" });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Mocking the ingestion process - in real world, map CSV columns to DB columns
                // Assuming CSV has: medicine_id, quantity, total_price
                let count = 0;
                for (const row of results) {
                    if (row.medicine_id && row.quantity && row.total_price) {
                        await salesModel.addSale(row.medicine_id, row.quantity, row.total_price);
                        count++;
                    }
                }
                res.json({ message: `Successfully imported ${count} sales records.` });
            } catch (e) {
                res.status(500).json({ error: "Failed to import data" });
            }
        });
};

module.exports = { recordSale, getSalesHistory, getForecast, importSalesData };
