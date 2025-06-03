import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'

import AdminLayout from './layouts/AdminLayout'
import PublicLayout from './layouts/PublicLayout'

import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DiseaseDetailPage from './pages/DiseaseDetailPage'
import ContactPage from './pages/ContactPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDiseasesPage from './pages/admin/ManageDiseasesPage'
import ManageFeedbackPage from './pages/admin/ManageFeedbackPage'
import ManageUsersPage from './pages/admin/ManageUsersPage'
import ManageCategoriesPage from './pages/admin/ManageCategoriesPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/diseases/:id" element={<DiseaseDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<ManageCategoriesPage />} />
              <Route path="diseases" element={<ManageDiseasesPage />} />
              <Route path="feedback" element={<ManageFeedbackPage />} />
              <Route path="users" element={<ManageUsersPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>,
)
