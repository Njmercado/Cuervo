import { useAuth } from "../contexts/AuthContext"
import { Box, CircularProgress } from "@mui/material"
import { Login } from "../components/pages/Login"
import { PasswordResetModal } from "../components/molecules/PasswordResetModal"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, requiresPasswordChange } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if (!session) {
    return <Login />
  }

  if (requiresPasswordChange) {
    return <PasswordResetModal />
  }

  return (
    <>
      {children}
    </>
  )
}