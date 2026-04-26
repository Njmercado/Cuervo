import { Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import { Activate } from './components/Activate'
import { Dashboard } from './components/Dashboard'
import { AuthProvider } from './contexts/AuthContext'
import { Public } from './components/Public'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, createTheme, } from '@mui/material'
import { ProtectedRoute } from './utils/protectedRoute'
import { ROUTES } from './constants'
import { Landing } from './components/Landing'
import { Buy } from './components/Buy'
import { RecoverPassword } from './components/RecoverPassword'
import { UpdatePassword } from './components/UpdatePassword'

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      primary: {
        100: string;
        30: string;
        20: string;
        10: string;
      };
      secondary: {
        100: string;
      };
      tertiary: {
        100: string;
        80: string;
        20: string;
        5: string;
      };
      neutral: {
        100: string;
        90: string;
        70: string;
      };
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
      tiny: '10px',
      small: '12px',
      base: '15px',
      lg: '18px',
      xl: '24px',
      h3: '36px',
      h2: '48px',
      h1: '64px',
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
      primary: {
        100: 'rgba(0, 110, 42, 1)',
        30: 'rgba(0, 110, 42, 0.3)',
        20: 'rgba(0, 110, 42, 0.2)',
        10: 'rgba(0, 110, 42, 0.1)',
      },
      secondary: {
        100: 'rgba(0, 200, 83, 1)',
      },
      tertiary: {
        100: 'rgba(198, 40, 40, 1)',
        80: 'rgba(198, 40, 40, 0.8)',
        20: 'rgba(198, 40, 40, 0.2)',
        5: 'rgba(198, 40, 40, 0.05)',
      },
      neutral: {
        100: 'rgba(238, 238, 240, 1)',
        90: 'rgba(238, 238, 240, 0.9)',
        70: 'rgba(238, 238, 240, 0.7)',
      },
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
        containedError: {
          backgroundColor: 'rgba(198, 40, 40, 1)',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(155, 30, 30, 1)',
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
          {/* TODO: Wrap Landing and Buy views into one single view to avoid render again the header, footer and common components */}
          <Route path={ROUTES.LANDING} element={<Landing />} />
          <Route path={ROUTES.BUY} element={<Buy />} />
          <Route path={ROUTES.LOG_IN} element={<Login />} />
          <Route path={ROUTES.RECOVER_PASSWORD} element={<RecoverPassword />} />
          <Route path={ROUTES.UPDATE_PASSWORD} element={<UpdatePassword />} />
          <Route path={ROUTES.ACTIVATE + "/:license_id?"} element={<Activate />} />
          <Route path={ROUTES.DASHBOARD + "/*"} element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.PUBLIC + "/:token"} element={<Public />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
