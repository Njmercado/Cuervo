import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Dashboard } from './components/Dashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Public } from './components/Public'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      glassBg: string;
      glassBorder: string;
      glassHoverBg: string;
      glassHoverBorder: string;
      glassFocusBorder: string;
      glowShadow: string;
      errorBg: string;
      errorBorder: string;
      errorLight: string;
      neutralLight: string;
      neutralMedium: string;
      neutralDark: string;
      accent: string;
      accentDark: string;
      accentGlow: string;
      transparent: string;
    }
  }
  interface PaletteOptions {
    custom?: Partial<Palette['custom']>;
  }

  interface Theme {
    size: (factor: number) => string;
    customSizes: {
      contentWidth: number;
      font: {
        tiny: string;
        small: string;
        base: string;
        lg: string;
        xl: string;
        h3: string;
        h2: string;
        h1: string;
      };
      radius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        pill: string;
        circle: string;
      };
    };
  }
  interface ThemeOptions {
    size?: (factor: number) => string;
    customSizes?: Partial<Theme['customSizes']>;
  }
}
const lightTheme = createTheme({
  size: (factor: number) => `${factor * 0.25}rem`,
  customSizes: {
    contentWidth: 1200,
    font: {
      tiny: '0.625rem',  // 10px
      small: '0.75rem',  // 12px
      base: '0.9375rem', // 15px
      lg: '1.125rem',    // 18px
      xl: '1.5rem',      // 24px
      h3: '2.25rem',     // 36px
      h2: '3rem',        // 48px
      h1: '4rem',        // 64px
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
      pill: '9999px',
      circle: '50%',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#006E2A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00C853',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#444444',
      disabled: '#9e9e9e',
    },
    divider: '#00C853',
    warning: {
      main: '#eab308',
    },
    error: {
      main: '#C62828',
    },
    custom: {
      glassBg: 'rgba(238, 238, 240, 0.7)',
      glassBorder: 'rgba(0, 110, 42, 0.1)',
      glassHoverBg: 'rgba(238, 238, 240, 0.9)',
      glassHoverBorder: 'rgba(0, 110, 42, 0.2)',
      glassFocusBorder: 'rgba(0, 110, 42, 0.3)',
      glowShadow: '0 4px 20px rgba(0, 110, 42, 0.15)',
      errorBg: 'rgba(198, 40, 40, 0.05)',
      errorBorder: 'rgba(198, 40, 40, 0.2)',
      errorLight: '#C62828',
      neutralLight: '#EEEEF0',
      neutralMedium: '#A0A0A5',
      neutralDark: '#333333',
      accent: '#00C853',
      accentDark: '#006E2A',
      accentGlow: '0 4px 20px rgba(0, 200, 83, 0.2)',
      transparent: 'rgba(255, 255, 255, 0.1)',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: '0.05em',
          padding: '12px 24px',
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#00C853',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#00b047',
          },
        },
        containedSecondary: {
          backgroundColor: '#e0e0e0',
          color: '#006E2A',
          '&:hover': {
            backgroundColor: '#9e9e9e',
          },
        },
        outlined: {
          borderColor: 'rgba(0,0,0,0.1)',
          color: '#006E2A',
          '&:hover': {
            backgroundColor: '#f2f2f2',
            borderColor: 'rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#e8ecef',
          borderRadius: 8,
          fontSize: 15,
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #00C853',
          },
        },
        input: {
          padding: '14px 16px',
          '&::placeholder': {
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 10,
          fontWeight: 800,
          color: '#006E2A',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 8,
          position: 'relative',
          transform: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          borderLeft: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        a: {
          color: '#006E2A',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.05em',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

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

  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: lightTheme.palette.background.paper,
              color: lightTheme.palette.text.primary,
              border: `1px solid ${lightTheme.palette.divider}`,
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: lightTheme.palette.text.primary,
                secondary: lightTheme.palette.background.default,
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/public/:token" element={<Public />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
