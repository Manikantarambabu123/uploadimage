# MediWound AI - Setup Instructions

This project consists of a **Django Backend** and a **React (Vite) Frontend**.

## Prerequisites
- Python 3.9+
- Node.js & npm
- PostgreSQL (running locally)

---

## 🚀 Backend Setup

1. **Database Configuration**:
   - Create a PostgreSQL database named `wound_db`.
   - Ensure you have a user `postgres` with password `baddu` (or update `Backend/wound_backend/settings.py` with your credentials).

2. **Install Dependencies**:
   ```powershell
   cd Backend
   pip install -r requirements.txt
   ```

3. **Migrations & Superuser**:
   ```powershell
   python manage.py migrate
   python create_superuser.py
   ```

4. **Run Server**:
   ```powershell
   python manage.py runserver
   ```

---

## 💻 Frontend Setup

1. **Install Dependencies**:
   ```powershell
   cd Frontend
   npm install
   ```

2. **Configuration**:
   - API endpoints are managed in `Frontend/src/config.js`. By default, it points to `http://127.0.0.1:8000`.

3. **Run Dev Server**:
   ```powershell
   npm run dev
   ```

---

## 🛠 Features Implemented
- **Login Redirect**: Access `http://127.0.0.1:8000/` to be redirected to the Admin panel.
- **Dynamic Assessments**: Creation of real assessment records with unique Patient IDs.
- **Branding**: Customized Admin login with "MediWound AI" logo and professional background.
- **Sidebar**: Active state highlighting for Dashboard, Patients, and Assessments.
