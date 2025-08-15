import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import glassTheme from './styles/glassTheme';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Practice from './pages/Practice';
import History from './pages/History';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

/**
 * ProtectedRoute checks if the user is logged in before rendering children.
 * If not logged in, redirects to /login
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

/**
 * PublicRoute redirects logged-in users away from login/register pages
 */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : children;
};

function AppContent() {
  const location = useLocation();

  // Hide Navbar on login and register pages
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavbar && <Navbar />}
      <Toaster position="top-center" reverseOrder={false} />

      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

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
