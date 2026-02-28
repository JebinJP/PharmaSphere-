Digital Pharmacy Management System

A modern, AI-powered pharmacy management system designed to streamline operations, manage inventory, and provide intelligent insights.

## 🚀 Features

### 📦 Inventory Management
- **Role-Based Access**:
    - **Pharmacists**: View-only access to medicine stock and prices.
    - **Admins**: Full control to Add, Update, and Delete medicines.
- **Batch Import**: Admins can bulk upload inventory via CSV files.
- **Real-time Updates**: changes are reflected instantly.

### 💰 Sales & Billing
- **Interactive Point of Sale**:
    - Search medicines by Name or ID with bidirectional autofill.
    - **Custom Pricing**: Auto-fills default price but allows manual overrides for specific sales.
    - Automatic stock deduction.
- **Currency**: Localized for Indian Market (₹ INR).

### 🤖 AI Assistant (Gemini)
- **Context-Aware Chat**: Integrates with live inventory data to answer questions like:
    - "How much Paracetamol is in stock?"
    - "What is the price of Ibuprofen?"
- **Direct Answers**: Optimized to provide concise, data-driven responses without unnecessary conversational filler.
- **Prescription OCR**: (Coming soon) Extract medicine details from prescription images.

### 📈 Analytics & Forecasting
- **Demand Forecasting**: Uses historical sales data to predict future demand for specific medicines using linear regression.
- **Dashboard**: Visual insights into sales trends and inventory status.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Chart.js, React Markdown
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **AI/ML**: Google Gemini API (Generative AI), Simple Statistics (Forecasting)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### 1. Database Setup
Ensure PostgreSQL is running and create a database (e.g., `pharmacy_db`). The application will automatically create the required tables on startup.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in `backend/` with:
   ```env
   PORT=5000
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pharmacy_db
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   GEMINI_MODEL_NAME=gemini-2.5-flash
   ```
4. Initialize Admin User:
   ```bash
   node src/scripts/createAdmin.js
   ```
   *Default Credentials:* `admin` / `admin`
5. Start the server:
   ```bash
   npm start
   # or for development
   node index.js
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔑 Default Credentials
- **Role**: ADMIN
- **Username**: `admin`
- **Password**: `admin`

## 📂 Project Structure
```
root
├── backend/
│   ├── src/
│   │   ├── config/         # DB Connection
│   │   ├── controllers/    # Logic (Auth, Inventory, Sales, Chat)
│   │   ├── models/         # DB Queries
│   │   ├── routes/         # API Endpoints
│   │   ├── services/       # AI & Forecast Services
│   │   └── utils/          # Middleware (Auth)
│   └── uploads/            # Temp storage for CSV imports
└── frontend/
    ├── src/
    │   ├── context/        # Auth Context
    │   ├── pages/          # React Components (Inventory, Sales, Chat)
    │   └── services/       # Axios API calls
```
