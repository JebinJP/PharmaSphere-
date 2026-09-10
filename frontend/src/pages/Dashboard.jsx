import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        prescriptionCount: 0,
        lowStockCount: 0,
        salesTrends: []
    });
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await getDashboardStats();
            setStats(data);

            if (data.salesTrends) {
                const labels = data.salesTrends.map(item => new Date(item.date).toLocaleDateString());
                const revenues = data.salesTrends.map(item => Number(item.total));

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Daily Revenue',
                            data: revenues,
                            backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        }
                    ]
                });
            }
        } catch (e) {
            console.error("Failed to load dashboard stats", e);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Dashboard</h2>
            <div className="dashboard-grid">
                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Daily Sales</h3>
                    <p className="stat-value text-blue">₹{Number(stats.totalRevenue).toFixed(2)}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Today's Revenue</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Weekly Sales</h3>
                    <p className="stat-value" style={{ color: '#8b5cf6' }}>₹{Number(stats.weeklyRevenue).toFixed(2)}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Last 7 Days</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Monthly Sales</h3>
                    <p className="stat-value" style={{ color: '#f59e0b' }}>₹{Number(stats.monthlyRevenue).toFixed(2)}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Last 30 Days</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Prescriptions</h3>
                    <p className="stat-value text-green">{stats.prescriptionCount}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Processed Today</p>
                </div>
                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Low Stock</h3>
                    <p className="stat-value text-red">{stats.lowStockCount}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Items Alert</p>
                </div>
            </div>

            <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                {chartData ? (
                    <Bar options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Last 7 Days Revenue' },
                        },
                    }} data={chartData} />
                ) : (
                    <span style={{ color: '#9ca3af' }}>Loading Sales Trends...</span>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
