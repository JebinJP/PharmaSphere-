const db = require('../config/db');

const createPrescription = async (imagePath, extractedData) => {
    const result = await db.query(
        'INSERT INTO prescriptions (image_path, extracted_data, status) VALUES ($1, $2, $3) RETURNING *',
        [imagePath, extractedData, 'PROCESSED']
    );
    return result.rows[0];
};

const getAllPrescriptions = async () => {
    const result = await db.query('SELECT * FROM prescriptions ORDER BY created_at DESC');
    return result.rows;
};

const getPrescriptionById = async (id) => {
    const result = await db.query('SELECT * FROM prescriptions WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = { createPrescription, getAllPrescriptions, getPrescriptionById };
