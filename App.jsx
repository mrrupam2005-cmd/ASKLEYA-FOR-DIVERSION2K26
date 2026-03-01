import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';

// Lazy load pages for performance
const LanguageSelection = lazy(() => import('./components/LanguageSelection'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));
const AIDoctor = lazy(() => import('./pages/AIDoctor'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const SpecialistList = lazy(() => import('./pages/SpecialistList'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const ConsultationTypeSelection = lazy(() => import('./pages/ConsultationTypeSelection'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('./pages/DoctorAppointments'));
const PharmacyBloodBank = lazy(() => import('./pages/PharmacyBloodBank'));
const PharmacyList = lazy(() => import('./pages/PharmacyList'));
const BloodBankList = lazy(() => import('./pages/BloodBankList'));
const PharmacyDetails = lazy(() => import('./pages/PharmacyDetails'));
const BloodBankDetails = lazy(() => import('./pages/BloodBankDetails'));
const MyPrescriptions = lazy(() => import('./pages/MyPrescriptions'));
const DoctorPrescriptions = lazy(() => import('./pages/DoctorPrescriptions'));
const HospitalList = lazy(() => import('./pages/HospitalList'));
const AmbulanceSelection = lazy(() => import('./pages/AmbulanceSelection'));
const SupplierDashboard = lazy(() => import('./pages/SupplierDashboard'));
const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PatientRecords = lazy(() => import('./pages/PatientRecords'));
const PatientMedicalHistory = lazy(() => import('./pages/PatientMedicalHistory'));
const WritePrescription = lazy(() => import('./pages/WritePrescription'));
const PrescribeForm = lazy(() => import('./pages/PrescribeForm'));
const ReportsList = lazy(() => import('./pages/ReportsList'));
const ReportView = lazy(() => import('./pages/ReportView'));
const Consultation = lazy(() => import('./pages/Consultation'));
const ConsultationRoom = lazy(() => import('./pages/ConsultationRoom'));
const Messages = lazy(() => import('./pages/Messages'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/select-language" element={<LanguageSelection />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/appointments" element={<Navigate to="/doctor-appointments" replace />} />
            <Route path="/doctor/patient-records" element={<PatientRecords />} />
            <Route path="/doctor/patient-records/:patientId" element={<PatientMedicalHistory />} />
            <Route path="/write-prescription" element={<WritePrescription />} />
            <Route path="/write-prescription/:patientId" element={<PrescribeForm />} />
            <Route path="/reports" element={<ReportsList />} />
            <Route path="/reports/:patientId" element={<ReportView />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/consultation-room/:id" element={<ConsultationRoom />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />

            {/* Role Dashboards */}
            <Route path="/login-doctor" element={<PlaceholderPage title="Doctor Login" />} />
            <Route path="/login-driver" element={<DriverDashboard />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/login-supplier" element={<SupplierDashboard />} />
            <Route path="/supplier-dashboard" element={<SupplierDashboard />} />

            {/* Feature Routes */}
            <Route path="/ai-doctor" element={<AIDoctor />} />
            <Route path="/doctors" element={<SpecialistList />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/doctors/:id/consultation-type" element={<ConsultationTypeSelection />} />
            <Route path="/pharmacy-services" element={<PharmacyBloodBank />} />
            <Route path="/pharmacies" element={<PharmacyList />} />
            <Route path="/blood-banks" element={<BloodBankList />} />
            <Route path="/pharmacy-details/:id" element={<PharmacyDetails />} />
            <Route path="/blood-bank-details/:id" element={<BloodBankDetails />} />
            <Route path="/pressure-check" element={<PlaceholderPage title="Blood Pressure Check" />} />
            <Route path="/sugar-check" element={<PlaceholderPage title="Blood Sugar Check" />} />
            <Route path="/prescriptions" element={<MyPrescriptions />} />
            <Route path="/prescriptions/:doctorId" element={<DoctorPrescriptions />} />
            <Route path="/ambulances" element={<HospitalList />} />
            <Route path="/ambulance/:hospitalId" element={<AmbulanceSelection />} />

            {/* User Nav Routes */}
            <Route path="/appointments" element={<PlaceholderPage title="My Appointments" />} />
            <Route path="/records" element={<PlaceholderPage title="Medical Records" />} />
            <Route path="/profile" element={<PlaceholderPage title="My Profile" />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
