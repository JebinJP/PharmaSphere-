const prescriptionModel = require('../models/prescriptionModel');
const geminiService = require('../services/geminiService');
const fs = require('fs');

const uploadPrescription = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const filePath = req.file.path;

        // 1. AI Structured Extraction (Primary & Only Method)
        // Per user request: Primary use Gemini. If fails, inform user.
        const extractedData = await geminiService.extractPrescriptionData(null, filePath); // text arg is null now

        if (!extractedData || !extractedData.medicines) {
            return res.status(422).json({
                error: 'Failed to extract data. Please try uploading a higher quality image.'
            });
        }

        // 2. Save to DB
        const newPrescription = await prescriptionModel.createPrescription(filePath, extractedData);

        res.status(201).json({
            message: 'Prescription processed successfully',
            data: newPrescription
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process prescription. AI Service unavailable.' });
    }
};

const getPrescriptions = async (req, res) => {
    try {
        const list = await prescriptionModel.getAllPrescriptions();
        res.json(list);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch prescriptions" });
    }
};

const getPrescription = async (req, res) => {
    try {
        const item = await prescriptionModel.getPrescriptionById(req.params.id);
        if (!item) return res.status(404).json({ error: "Not Found" });
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch prescription" });
    }
};

module.exports = { uploadPrescription, getPrescriptions, getPrescription };
