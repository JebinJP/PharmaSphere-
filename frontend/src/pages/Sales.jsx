import { useState, useEffect } from 'react';
import { getForecast, recordSale, getInventory } from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Sales = () => {
    const [medicineId, setMedicineId] = useState('');
    const [forecastData, setForecastData] = useState(null);
    const [chartData, setChartData] = useState(null);

    // New State for Recording Sales
    const [saleMedicineId, setSaleMedicineId] = useState('');
    const [saleQuantity, setSaleQuantity] = useState('');
    const [salePrice, setSalePrice] = useState(''); // New Price State
    const [saleMessage, setSaleMessage] = useState(null);
    const [saleError, setSaleError] = useState(null);

    // Search/Dropdown State
    const [medicines, setMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Forecast Search State
    const [forecastSearchTerm, setForecastSearchTerm] = useState('');
    const [isForecastDropdownOpen, setIsForecastDropdownOpen] = useState(false);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const { data } = await getInventory();
            setMedicines(data);
        } catch (error) {
            console.error("Failed to fetch medicines", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
        // Clear ID if users changes name manually
        setSaleMedicineId('');
        setSalePrice(''); // Clear price on manual name change
    };

    const handleSelectMedicine = (medicine) => {
        setSaleMedicineId(medicine.id);
        setSearchTerm(medicine.name);
        setSalePrice(medicine.price); // Set Price from inventory
        setIsDropdownOpen(false);
    };

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Forecast Handlers
    const handleForecastSearchChange = (e) => {
        setForecastSearchTerm(e.target.value);
        setIsForecastDropdownOpen(true);
        setMedicineId('');
    };

    const handleSelectForecastMedicine = (medicine) => {
        setMedicineId(medicine.id);
        setForecastSearchTerm(medicine.name);
        setIsForecastDropdownOpen(false);
    };

    const filteredForecastMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(forecastSearchTerm.toLowerCase())
    );

    const handleForecast = async (e) => {
        e.preventDefault();
        try {
            const { data } = await getForecast(medicineId);
            setForecastData(data);
            prepareChart(data);
        } catch (e) {
            alert('Failed to get forecast');
        }
    };

    const handleRecordSale = async (e) => {
        e.preventDefault();
        setSaleMessage(null);
        setSaleError(null);

        try {
            await recordSale({
                medicineId: saleMedicineId,
                quantity: Number(saleQuantity),
                pricePerUnit: Number(salePrice) // Send custom price
            });
            setSaleMessage('Sale recorded successfully!');
            setSaleMedicineId('');
            setSaleQuantity('');
            setSalePrice('');
            setSearchTerm('');
        } catch (err) {
            setSaleError('Failed to record sale. Check ID or Stock.');
        }
    };

    const prepareChart = (data) => {
        if (!data.history || data.error) return;

        const historyDates = data.history.map(h => new Date(h.date).toLocaleDateString());
        const historyQuantities = data.history.map(h => Number(h.quantity));

        // Generate future dates
        const lastDate = new Date(data.history[data.history.length - 1].date);
        const futureDates = data.forecast.map(f => {
            const d = new Date(lastDate);
            d.setDate(d.getDate() + f.day);
            return d.toLocaleDateString();
        });

        const labels = [...historyDates, ...futureDates];

        // History dataset (pad with nulls for future)
        const historyData = [...historyQuantities, ...Array(data.forecast.length).fill(null)];

        // Forecast dataset (pad with nulls for history, but start connecting from last history point)
        const lastHistoryVal = historyQuantities[historyQuantities.length - 1];
        const forecastDataPoints = [lastHistoryVal, ...data.forecast.map(f => f.predictedQty)];
        const forecastPadding = Array(historyQuantities.length - 1).fill(null);
        const forecastDataFinal = [...forecastPadding, ...forecastDataPoints];

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Historical Sales',
                    data: historyData,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    tension: 0.2
                },
                {
                    label: 'Forecasted Demand',
                    data: forecastDataFinal,
                    borderColor: 'rgb(147, 51, 234)',
                    backgroundColor: 'rgba(147, 51, 234, 0.5)',
                    borderDash: [5, 5],
                    tension: 0.2
                }
            ]
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sales Management</h2>

            {/* Record Sale Section */}
            <div className="card" style={{ overflow: 'visible' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>Record New Sale</h3>
                <form onSubmit={handleRecordSale} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>

                    {/* Medicine ID Input */}
                    <div style={{ flex: '0 0 80px' }}>
                        <label className="form-label">Med ID</label>
                        <input
                            type="text"
                            value={saleMedicineId}
                            onChange={(e) => {
                                const newId = e.target.value;
                                setSaleMedicineId(newId);
                                const found = medicines.find(m => m.id.toString() === newId);
                                if (found) {
                                    setSearchTerm(found.name);
                                    setSalePrice(found.price);
                                } else {
                                    setSearchTerm('');
                                    setSalePrice('');
                                }
                            }}
                            className="form-input"
                            placeholder="ID"
                            required
                        />
                    </div>

                    {/* Medicine Search Dropdown */}
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <label className="form-label">Medicine Name</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setIsDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                            className="form-input"
                            placeholder="Type to search..."
                            required
                        />
                        {/* Dropdown Logic */}
                        {isDropdownOpen && filteredMedicines.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                marginTop: '0.25rem',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 50,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                {filteredMedicines.map(medicine => (
                                    <div
                                        key={medicine.id}
                                        onClick={() => handleSelectMedicine(medicine)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f3f4f6',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <span style={{ fontWeight: 500 }}>{medicine.name}</span>
                                        <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Stock: {medicine.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Input */}
                    <div style={{ flex: '0 0 100px' }}>
                        <label className="form-label">Price (₹)</label>
                        <input
                            type="number"
                            value={salePrice}
                            onChange={e => setSalePrice(e.target.value)}
                            className="form-input"
                            placeholder="₹"
                            required
                            step="0.01"
                        />
                    </div>

                    {/* Quantity Input */}
                    <div style={{ flex: '0 0 80px' }}>
                        <label className="form-label">Qty</label>
                        <input
                            type="number"
                            value={saleQuantity}
                            onChange={e => setSaleQuantity(e.target.value)}
                            className="form-input"
                            placeholder="Qty"
                            required
                            min="1"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10b981', height: '42px', padding: '0 1.5rem' }}>Record</button>
                    </div>
                </form>
                {saleMessage && <div style={{ color: '#059669', marginTop: '0.5rem', fontWeight: '500' }}>{saleMessage}</div>}
                {saleError && <div style={{ color: '#dc2626', marginTop: '0.5rem', fontWeight: '500' }}>{saleError}</div>}
            </div>

            {/* Forecasting Section */}
            <div className="card" style={{ overflow: 'visible' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>Demand Forecasting</h3>
                <form onSubmit={handleForecast} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>

                    {/* Medicine ID Input */}
                    <div style={{ flex: '0 0 100px' }}>
                        <label className="form-label">Med ID</label>
                        <input
                            type="text"
                            value={medicineId}
                            onChange={(e) => {
                                const newId = e.target.value;
                                setMedicineId(newId);
                                const found = medicines.find(m => m.id.toString() === newId);
                                if (found) {
                                    setForecastSearchTerm(found.name);
                                } else {
                                    setForecastSearchTerm('');
                                }
                            }}
                            className="form-input"
                            placeholder="ID"
                            required
                        />
                    </div>

                    {/* Medicine Search Dropdown */}
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <label className="form-label">Medicine Name</label>
                        <input
                            type="text"
                            value={forecastSearchTerm}
                            onChange={handleForecastSearchChange}
                            onFocus={() => setIsForecastDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsForecastDropdownOpen(false), 200)}
                            className="form-input"
                            placeholder="Type to search..."
                            required
                        />

                        {isForecastDropdownOpen && filteredForecastMedicines.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.375rem',
                                marginTop: '0.25rem',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 50,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                {filteredForecastMedicines.map(medicine => (
                                    <div
                                        key={medicine.id}
                                        onClick={() => handleSelectForecastMedicine(medicine)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f3f4f6',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <span style={{ fontWeight: 500 }}>{medicine.name}</span>
                                        <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Stock: {medicine.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    <div>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#9333ea', height: '42px', padding: '0 1.5rem' }}>Generate Forecast</button>
                    </div>
                </form>

                {forecastData && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Forecast Results</h3>

                        {forecastData.error ? (
                            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.375rem', marginTop: '1rem' }}>
                                {forecastData.error}
                            </div>
                        ) : (
                            <>
                                <p style={{ color: '#4b5563' }}>Trend Slope: {forecastData.trend?.toFixed(3)}</p>

                                <div style={{ marginTop: '1rem' }}>
                                    <h4 style={{ fontWeight: '600' }}>Next 7 Days Prediction:</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {forecastData.forecast.map(day => (
                                            <div key={day.day} style={{ backgroundColor: '#faf5ff', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', border: '1px solid #f3e8ff' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Day +{day.day}</div>
                                                <div style={{ fontWeight: 'bold', color: '#7e22ce' }}>{day.predictedQty} units</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {chartData && (
                <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <Line options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Demand Forecast Chart' },
                        },
                    }} data={chartData} />
                </div>
            )}
        </div>
    );
};

export default Sales;
