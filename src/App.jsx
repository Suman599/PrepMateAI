import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import glassTheme from './styles/glassTheme';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Practice from './pages/Practice';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

/**
 * @component AppContent
 * @description This component handles the core routing and layout. 
 * It's separated so it can be wrapped by AuthProvider and use its context.
 */

function AppContent() {
  const location = useLocation();

  // Hide Navbar on login and register pages for a more focused experience
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    // This Box is the main layout container. It solves the responsiveness issue.
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* The Navbar is now rendered conditionally based on the route */}
      {showNavbar && <Navbar />}

      {/* The Toaster provides notifications throughout the app */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* This Box holds the main page content and allows it to grow and fill the space */}
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes wrapped for authentication */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/practice" 
            element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Box>
    </Box>
  );
}


/**
 * @component App
 * @description The root component that sets up themes, providers, and routing.
 */
function App() {
  return (
    <ThemeProvider theme={glassTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;