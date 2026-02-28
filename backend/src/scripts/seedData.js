const db = require('../config/db');

const medicines = [
    { name: 'Paracetamol 500mg', quantity: 500, price: 5.00 },
    { name: 'Amoxicillin 250mg', quantity: 300, price: 12.50 },
    { name: 'Ibuprofen 400mg', quantity: 400, price: 8.00 },
    { name: 'Cetirizine 10mg', quantity: 600, price: 3.50 },
    { name: 'Metformin 500mg', quantity: 200, price: 4.00 }
];

const seedData = async () => {
    try {
        console.log("Starting data seed...");

        // 1. Insert Medicines
        const medicineIds = [];
        for (const med of medicines) {
            // Check if exists to avoid duplicates or just insert
            // For simplicity, we'll simple insert. If names are unique, we might handle conflict.
            // Our Schema didn't strictly enforce unique names, but let's assume we want fresh data.
            // Let's just Insert.
            const res = await db.query(
                "INSERT INTO medicines (name, quantity, price) VALUES ($1, $2, $3) RETURNING id",
                [med.name, med.quantity, med.price]
            );
            medicineIds.push(res.rows[0].id);
            console.log(`Inserted ${med.name}, ID: ${res.rows[0].id}`);
        }

        // 2. Generate Sales Data (Past 30 Days)
        console.log("Generating 30 days of sales history...");
        const today = new Date();

        for (const medId of medicineIds) {
            for (let i = 30; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);

                // Random quantity between 5 and 50
                // Add some trend: higher sales for recent days for Paracetamol
                let baseQty = Math.floor(Math.random() * 20) + 5;
                if (medId === medicineIds[0]) baseQty += (30 - i); // Upward trend

                const totalPrice = baseQty * 5.00; // Approximate price usage

                await db.query(
                    "INSERT INTO sales (medicine_id, quantity, total_price, sale_date) VALUES ($1, $2, $3, $4)",
                    [medId, baseQty, totalPrice, date]
                );
            }
        }

        console.log("Seeding complete! You can now check the Dashboard and Forecasts.");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        process.exit();
    }
};

seedData();
