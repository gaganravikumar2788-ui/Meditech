import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import PatientsPage from './pages/PatientsPage';
import VideoConsultPage from './pages/VideoConsultPage';
import WellnessAIPage from './pages/WellnessAIPage';
import VideosPage from './pages/VideosPage';
import HospitalsPage from './pages/HospitalsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/video-consult" element={<VideoConsultPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/ai" element={<WellnessAIPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
