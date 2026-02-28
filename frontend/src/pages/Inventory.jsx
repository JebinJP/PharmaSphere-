import { useEffect, useState } from 'react';
import { getInventory, addMedicine, importInventory } from '../services/api'; // Added importInventory
import { useAuth } from '../context/AuthContext'; // Added useAuth

const Inventory = () => {
    const { user } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0 });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const { data } = await getInventory();
            setMedicines(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addMedicine(newItem);
            setNewItem({ name: '', quantity: 0, price: 0 });
            fetchInventory();
        } catch (error) {
            alert('Failed to add item');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await importInventory(file);
            alert('Inventory imported successfully!');
            fetchInventory();
        } catch (error) {
            alert('Failed to import inventory');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Inventory Management</h2>

            {isAdmin && (
                <>
                    {/* Add Item Form */}
                    <form onSubmit={handleAdd} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Medicine Name</label>
                            <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="form-input" required />
                        </div>
                        <div style={{ width: '150px' }}>
                            <label className="form-label">Quantity</label>
                            <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} className="form-input" required />
                        </div>
                        <div style={{ width: '150px' }}>
                            <label className="form-label">Price</label>
                            <input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="form-input" required />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary" style={{ marginBottom: '2px' }}>Add Item</button>
                        </div>
                    </form>

                    {/* CSV Upload Section */}
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h4 style={{ fontWeight: '600', minWidth: '150px' }}>Batch Upload (CSV)</h4>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            style={{ flex: 1 }}
                        />
                        {uploading && <span style={{ color: '#2563eb' }}>Uploading...</span>}
                    </div>
                </>
            )}

            {!isAdmin && (
                <div style={{ padding: '1rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.375rem', color: '#1e40af' }}>
                    View-Only Access (Pharmacist)
                </div>
            )}

            {loading ? <p>Loading...</p> : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map(med => (
                                <tr key={med.id}>
                                    <td>{med.id}</td>
                                    <td>{med.name}</td>
                                    <td>{med.quantity}</td>
                                    <td>₹{med.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Inventory;
