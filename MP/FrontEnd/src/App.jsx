import { useState } from "react";

export default function App() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    expiryDate: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExpired, setFilterExpired] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addMedicine = () => {
    if (!form.name || !form.price) {
      alert("Please fill all required fields");
      return;
    }
    
    if (editIndex !== null) {
      // Update existing medicine
      const updated = [...medicines];
      updated[editIndex] = form;
      setMedicines(updated);
      setEditIndex(null);
    } else {
      // Add new medicine
      setMedicines([...medicines, form]);
    }
    
    setForm({ name: "", price: "", quantity: "", expiryDate: "" });
  };

  const editMedicine = (index) => {
    setForm(medicines[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteMedicine = (index) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const cancelEdit = () => {
    setForm({ name: "", price: "", quantity: "", expiryDate: "" });
    setEditIndex(null);
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterExpired || isExpired(med.expiryDate);
    return matchesSearch && matchesFilter;
  });

  const getTotalValue = () => {
    return medicines.reduce((sum, med) => {
      const price = parseFloat(med.price) || 0;
      const qty = parseInt(med.quantity) || 0;
      return sum + (price * qty);
    }, 0).toFixed(2);
  };

  return (
    <div style={{ 
      fontFamily: "Arial", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
      minHeight: "100vh", 
      width: "100%",
      padding: "20px",
      boxSizing: "border-box",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0
    }}>
      <h1 style={{ textAlign: "center", color: "#fff", marginBottom: "10px" }}>💊 Digital Pharmacy Management System</h1>
      <p style={{ textAlign: "center", color: "#fff", opacity: 0.9, marginTop: 0 }}>Manage your medicine inventory with ease</p>

      {/* Form Card */}
      <div style={{
        maxWidth: "500px",
        margin: "20px auto",
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ marginTop: 0, color: "#667eea" }}>{editIndex !== null ? "Edit Medicine" : "Add Medicine"}</h2>

        <input 
          name="name" 
          placeholder="Medicine Name *" 
          value={form.name} 
          onChange={handleChange} 
          style={inputStyle} 
        />
        <input 
          name="price" 
          type="number" 
          placeholder="Price (₹) *" 
          value={form.price} 
          onChange={handleChange} 
          style={inputStyle} 
        />
        <input 
          name="quantity" 
          type="number" 
          placeholder="Quantity" 
          value={form.quantity} 
          onChange={handleChange} 
          style={inputStyle} 
        />
        <input 
          name="expiryDate" 
          type="date" 
          value={form.expiryDate} 
          onChange={handleChange} 
          style={inputStyle} 
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={addMedicine} style={{...buttonStyle, flex: 1}}>
            {editIndex !== null ? "Update Medicine" : "Add Medicine"}
          </button>
          {editIndex !== null && (
            <button onClick={cancelEdit} style={{...buttonStyle, flex: 1, background: "#dc3545"}}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Stats and Search */}
      <div style={{
        maxWidth: "900px",
        margin: "30px auto",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        <div style={statCard}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#667eea" }}>{medicines.length}</div>
          <div style={{ color: "#666", fontSize: "14px" }}>Total Medicines</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#28a745" }}>₹{getTotalValue()}</div>
          <div style={{ color: "#666", fontSize: "14px" }}>Total Value</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#dc3545" }}>
            {medicines.filter(m => isExpired(m.expiryDate)).length}
          </div>
          <div style={{ color: "#666", fontSize: "14px" }}>Expired Items</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{
        maxWidth: "900px",
        margin: "20px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        gap: "15px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <input 
          type="text"
          placeholder="🔍 Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{...inputStyle, flex: 1, margin: 0, minWidth: "200px"}}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input 
            type="checkbox"
            checked={filterExpired}
            onChange={(e) => setFilterExpired(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <span>Show expired only</span>
        </label>
      </div>

      {/* Table */}
      <div style={{
        maxWidth: "900px",
        margin: "20px auto",
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        overflowX: "auto"
      }}>
        <h2 style={{ marginTop: 0, color: "#667eea" }}>Medicine Inventory ({filteredMedicines.length})</h2>

        {filteredMedicines.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
            {medicines.length === 0 ? "No medicines added yet. Start by adding one above!" : "No medicines match your search."}
          </p>
        ) : (
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Price (₹)</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Expiry Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((m, i) => {
                const originalIndex = medicines.indexOf(m);
                const expired = isExpired(m.expiryDate);
                return (
                  <tr key={i} style={{ 
                    borderBottom: "1px solid #dee2e6",
                    background: expired ? "#fff5f5" : "transparent",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = expired ? "#ffe5e5" : "#f8f9fa"}
                  onMouseLeave={(e) => e.currentTarget.style.background = expired ? "#fff5f5" : "transparent"}
                  >
                    <td style={tdStyle}>{m.name}</td>
                    <td style={tdStyle}>₹{m.price}</td>
                    <td style={tdStyle}>{m.quantity || "-"}</td>
                    <td style={tdStyle}>{m.expiryDate || "-"}</td>
                    <td style={tdStyle}>
                      {expired ? (
                        <span style={{
                          background: "#dc3545",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}>
                          Expired
                        </span>
                      ) : m.expiryDate ? (
                        <span style={{
                          background: "#28a745",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}>
                          Valid
                        </span>
                      ) : (
                        <span style={{ color: "#999" }}>-</span>
                      )}
                    </td>
                    <td style={{...tdStyle, display: "flex", gap: "8px", justifyContent: "center"}}>
                      <button 
                        onClick={() => editMedicine(originalIndex)}
                        style={actionButtonStyle}
                        onMouseEnter={(e) => e.target.style.background = "#0056b3"}
                        onMouseLeave={(e) => e.target.style.background = "#007bff"}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => deleteMedicine(originalIndex)}
                        style={{...actionButtonStyle, background: "#dc3545"}}
                        onMouseEnter={(e) => e.target.style.background = "#c82333"}
                        onMouseLeave={(e) => e.target.style.background = "#dc3545"}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  border: "2px solid #e0e0e0",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "border-color 0.3s",
  outline: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  transition: "background 0.3s, transform 0.1s"
};

const statCard = {
  flex: "1",
  minWidth: "150px",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  textAlign: "center"
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "600",
  color: "#495057"
};

const tdStyle = {
  padding: "12px",
  textAlign: "left",
  color: "#212529"
};

const actionButtonStyle = {
  padding: "6px 12px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  transition: "background 0.2s"
};