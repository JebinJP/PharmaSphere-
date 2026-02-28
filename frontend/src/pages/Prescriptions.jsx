import { useState, useEffect } from 'react';
import { uploadPrescription, getPrescriptions } from '../services/api';

const Prescriptions = () => {
    const [file, setFile] = useState(null);
    const [list, setList] = useState([]);
    const [result, setResult] = useState(null);

    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = async () => {
        try {
            const { data } = await getPrescriptions();
            setList(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('prescriptionImage', file);

        try {
            const { data } = await uploadPrescription(formData);
            setResult(data);
            fetchList();
        } catch (e) {
            alert('Upload failed: ' + (e.response?.data?.error || e.message));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Prescription Processing</h2>

            <form onSubmit={handleUpload} className="card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label className="form-label">Upload Scanned Prescription</label>
                    <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*,.pdf" className="form-input" style={{ padding: '0.5rem' }} />
                    <button type="submit" disabled={!file} className="btn btn-primary" style={{ width: 'fit-content' }}>
                        Process Image (Gemini AI)
                    </button>
                </div>
            </form>

            {result && (
                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '0.5rem' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#065f46' }}>Extraction Success</h3>
                    <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#047857', backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1fae5', overflow: 'auto' }}>
                        {JSON.stringify(result.data.extracted_data, null, 2)}
                    </pre>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div className="card" style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Recent Uploads</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>Click on an item to view details</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {list.map(item => (
                            <li
                                key={item.id}
                                onClick={() => setSelected(item)}
                                style={{
                                    padding: '0.75rem',
                                    borderBottom: '1px solid #e5e7eb',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    backgroundColor: selected?.id === item.id ? '#eff6ff' : 'transparent',
                                    borderRadius: '0.375rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selected?.id === item.id ? '#eff6ff' : '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected?.id === item.id ? '#eff6ff' : 'transparent'}
                            >
                                <span>ID: {item.id} - {new Date(item.created_at).toLocaleDateString()}</span>
                                <span style={{ fontSize: '0.875rem', backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{item.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {selected && (
                    <div className="card" style={{ flex: 1, border: '1px solid var(--primary-color)', position: 'sticky', top: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: 'bold' }}>Prescription Details (ID: {selected.id})</h3>
                            <button className="btn btn-danger" onClick={() => setSelected(null)} style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Close</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div><strong>Date:</strong> {new Date(selected.created_at).toLocaleString()}</div>
                            <div><strong>Status:</strong> {selected.status}</div>
                        </div>
                        <div>
                            <strong>Extracted Data:</strong>
                            <pre style={{
                                marginTop: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#1f2937',
                                backgroundColor: '#f3f4f6',
                                padding: '0.75rem',
                                borderRadius: '0.375rem',
                                overflow: 'auto',
                                maxHeight: '400px'
                            }}>
                                {JSON.stringify(selected.extracted_data, null, 2)}
                            </pre>
                        </div>
                        {selected.image_path && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Image Path: {selected.image_path}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescriptions;
