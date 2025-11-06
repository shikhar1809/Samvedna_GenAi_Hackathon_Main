import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import FloatingPeerMatchButton from './components/FloatingPeerMatchButton'

// Pages
import Landing from './pages/Landing'
import Analysis from './pages/Analysis'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import Journal from './pages/Journal'
import Diagnosis from './pages/Diagnosis'
import CBTReframe from './pages/CBTReframe'
import Companion from './pages/Companion'
import Vent from './pages/Vent'
import Groups from './pages/Groups'
import Gratitude from './pages/Gratitude'
import Library from './pages/Library'
import PeerMatch from './pages/PeerMatch'
import Reports from './pages/Reports'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diagnosis"
              element={
                <ProtectedRoute>
                  <Diagnosis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cbt-reframe"
              element={
                <ProtectedRoute>
                  <CBTReframe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companion"
              element={
                <ProtectedRoute>
                  <Companion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vent"
              element={
                <ProtectedRoute>
                  <Vent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gratitude"
              element={
                <ProtectedRoute>
                  <Gratitude />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />
            <Route
              path="/peer-match"
              element={
                <ProtectedRoute>
                  <PeerMatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App

