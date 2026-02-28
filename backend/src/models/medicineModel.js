const db = require('../config/db');

const getAllMedicines = async () => {
    const result = await db.query('SELECT * FROM medicines ORDER BY id ASC');
    return result.rows;
};

const getMedicineById = async (id) => {
    const result = await db.query('SELECT * FROM medicines WHERE id = $1', [id]);
    return result.rows[0];
};

const createMedicine = async (medicine) => {
    const { name, manufacturer, batch_number, expiration_date, quantity, price, description } = medicine;
    const result = await db.query(
        'INSERT INTO medicines (name, manufacturer, batch_number, expiration_date, quantity, price, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, manufacturer, batch_number, expiration_date, quantity, price, description]
    );
    return result.rows[0];
};

const updateMedicine = async (id, medicine) => {
    const { name, manufacturer, batch_number, expiration_date, quantity, price, description } = medicine;
    const result = await db.query(
        'UPDATE medicines SET name=$1, manufacturer=$2, batch_number=$3, expiration_date=$4, quantity=$5, price=$6, description=$7 WHERE id=$8 RETURNING *',
        [name, manufacturer, batch_number, expiration_date, quantity, price, description, id]
    );
    return result.rows[0];
};

const deleteMedicine = async (id) => {
    await db.query('DELETE FROM medicines WHERE id = $1', [id]);
    return { id };
};

module.exports = { getAllMedicines, getMedicineById, createMedicine, updateMedicine, deleteMedicine };
