const db = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        // Today's date for filtering
        const today = new Date().toISOString().split('T')[0];

        // 1. Daily Sales
        // Assuming sale_date is a TIMESTAMP, casting to DATE
        const salesResult = await db.query(
            "SELECT SUM(total_price) as total_revenue FROM sales WHERE DATE(sale_date) = CURRENT_DATE"
        );
        const totalRevenue = salesResult.rows[0].total_revenue || 0;

        // 2. Prescriptions Processed Today
        const prescriptionsResult = await db.query(
            "SELECT COUNT(*) as count FROM prescriptions WHERE DATE(created_at) = CURRENT_DATE"
        );
        const prescriptionCount = prescriptionsResult.rows[0].count || 0;

        // 3. Low Stock Items (Threshold < 20)
        const lowStockResult = await db.query(
            "SELECT COUNT(*) as count FROM medicines WHERE quantity < 20"
        );
        const lowStockCount = lowStockResult.rows[0].count || 0;

        // 4. Sales Trends (Last 7 Days)
        const trendsResult = await db.query(
            `SELECT DATE(sale_date) as date, SUM(total_price) as total 
             FROM sales 
             WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days' 
             GROUP BY DATE(sale_date) 
             ORDER BY DATE(sale_date) ASC`
        );
        const salesTrends = trendsResult.rows;

        res.json({
            totalRevenue,
            prescriptionCount,
            lowStockCount,
            salesTrends
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
};

module.exports = { getDashboardStats };
