import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Dashboard } from './components/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) return <div className="text-white">Loading...</div>
  if (!session) return <Navigate to="/" replace />

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
