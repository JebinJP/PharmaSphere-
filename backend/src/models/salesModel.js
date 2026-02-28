const db = require('../config/db');

const addSale = async (medicineId, quantity, totalPrice) => {
    const result = await db.query(
        'INSERT INTO sales (medicine_id, quantity, total_price) VALUES ($1, $2, $3) RETURNING *',
        [medicineId, quantity, totalPrice]
    );
    return result.rows[0];
};

const getAllSales = async () => {
    const result = await db.query(
        'SELECT s.*, m.name as medicine_name FROM sales s JOIN medicines m ON s.medicine_id = m.id ORDER BY s.sale_date DESC'
    );
    return result.rows;
};

// For forecasting: Get daily aggregated sales for a specific medicine
const getDailySalesForMedicine = async (medicineId) => {
    const result = await db.query(
        `SELECT DATE(sale_date) as date, SUM(quantity) as quantity 
         FROM sales 
         WHERE medicine_id = $1 
         GROUP BY DATE(sale_date) 
         ORDER BY DATE(sale_date) ASC`,
        [medicineId]
    );
    return result.rows;
};

module.exports = { addSale, getAllSales, getDailySalesForMedicine };
