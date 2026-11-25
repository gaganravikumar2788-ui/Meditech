# MEDITECH - Smart Healthcare Web Application

MEDITECH is a modern full-stack healthcare web application designed to connect patients with top hospital networks, doctor appointments, digital patient records, online video consultations, and an AI-powered wellness assistant.

---

## 🌟 Key Features

- **Digital Patient Records & Database**:
  - Automatically generates unique patient codes (`MED-1001`, `MED-1002`, ...).
  - Search registered patients by name, phone, email, or patient ID.
  - View detailed patient profiles including blood group, age, gender, medical history, linked appointments, and consultations.
- **Hospital Network & Appointment Booking**:
  - Integrated with top hospitals across Bengaluru including Fortis, Narayana, Kangaroo Health Care, Ramaiah, Ramakrishna, Manipal, Maggi General, GM Health Care, and **Bangalore Hospitals** (Jayanagar, Kengeri, and Carrollton Regional).
  - Browse specialist doctors with years of experience and book timed appointments directly into the database.
- **Online Doctor Consultations**:
  - Book video calls, phone calls, chat consultations, or emergency consultations.
  - Interactive dashboard showing consultation statistics, pending vs. confirmed status, and breakdown by medical specialty.
- **Medicom AI Wellness Assistant**:
  - Interactive chat interface for quick wellness suggestions on common ailments (headaches, cold, sore throat, fever, stomach aches, body pain, insomnia).
- **Health & Wellness Videos**:
  - Curated guide and video resources covering Meditation, Yoga, Stress Management, and Health & Hygiene.
- **Secure Phone OTP Verification**:
  - Phone-based authentication with OTP sessions stored in the backend database.

---

## 🛠️ Tech Stack

### Frontend (`frontend/`)
- **React 18** (Vite SPA)
- **Tailwind CSS v4**
- **React Router v7**
- **Lucide React** (Modern medical & UI icons)

### Backend (`backend/`)
- **Node.js** & **Express**
- **SQLite** (High-performance built-in `node:sqlite` engine)
- RESTful APIs for Patients, Appointments, Consultations, Hospitals, Statistics, and OTP Auth.

---

## 📂 Project Structure

```text
Meditech/
├── backend/
│   ├── db.js             # SQLite database initialization & patient helpers
│   ├── index.js          # Express REST API endpoints
│   ├── seedData.js       # Hospital network & doctors dataset
│   ├── vercel.json       # Vercel serverless deployment configuration
│   └── package.json
├── frontend/
│   ├── public/images/    # Application images & icons
│   ├── src/
│   │   ├── components/   # Navbar & Footer
│   │   ├── pages/        # Home, Registration, Patients, VideoConsult, AI, Videos, Hospitals, Login
│   │   ├── api.js        # API client with environment configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json       # Vercel SPA routing & rewrites
│   ├── vite.config.js
│   └── package.json
├── package.json          # Workspace root run scripts
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** v22.x or v24.x (for native `node:sqlite` support)
- **npm** v10+

### Installation
From the project root:
```bash
npm run install:all
```

### Running the Application

1. **Start the Backend API Server** (runs on `http://localhost:5000`):
   ```bash
   npm run dev:backend
   ```

2. **Start the React Frontend** (runs on `http://localhost:5173`):
   ```bash
   npm run dev:frontend
   ```

3. Open `http://localhost:5173` in your browser.

---

## 🌐 Deploying to Vercel

The application is structured to be deployed cleanly to Vercel as two separate services:

### 1. Deploy the Backend
1. Import this repository in Vercel.
2. Set **Root Directory** to `backend`.
3. Set **Node.js Version** to `24.x` in Project Settings.
4. Deploy and copy your production backend URL (e.g. `https://meditech-backend.vercel.app`).

### 2. Deploy the Frontend
1. Import this repository in Vercel again as a new project.
2. Set **Root Directory** to `frontend`.
3. Add the Environment Variable:
   - `VITE_API_URL` = `https://meditech-backend.vercel.app` (your backend URL without trailing slash)
4. Deploy.

---

## 📄 License
This project is developed for educational and academic purposes.
