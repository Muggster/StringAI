import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute, FullPageSpinner } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'

// Public pages (eager — needed immediately)
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Onboarding from '@/pages/Onboarding'
import NotFound from '@/pages/NotFound'

// Student pages (lazy)
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Practice = lazy(() => import('@/pages/Practice'))
const Session = lazy(() => import('@/pages/Session'))
const History = lazy(() => import('@/pages/History'))
const Coaching = lazy(() => import('@/pages/Coaching'))
const Goals = lazy(() => import('@/pages/Goals'))
const Drills = lazy(() => import('@/pages/Drills'))
const Chords = lazy(() => import('@/pages/Chords'))
const Lessons = lazy(() => import('@/pages/Lessons'))
const LessonDetail = lazy(() => import('@/pages/LessonDetail'))
const Tutor = lazy(() => import('@/pages/Tutor'))

// Admin pages (lazy)
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminDrills = lazy(() => import('@/pages/admin/AdminDrills'))
const AdminLessons = lazy(() => import('@/pages/admin/AdminLessons'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<FullPageSpinner />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Student (protected) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
          <Route path="/session/:planId" element={<ProtectedRoute><Session /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/coaching" element={<ProtectedRoute><Coaching /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/drills" element={<ProtectedRoute><Drills /></ProtectedRoute>} />
          <Route path="/chords" element={<ProtectedRoute><Chords /></ProtectedRoute>} />
          <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
          <Route path="/lessons/:id" element={<ProtectedRoute><LessonDetail /></ProtectedRoute>} />
          <Route path="/tutor" element={<ProtectedRoute><Tutor /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/drills" element={<AdminRoute><AdminDrills /></AdminRoute>} />
          <Route path="/admin/lessons" element={<AdminRoute><AdminLessons /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}
