import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import HomeIcon from '@mui/icons-material/Home';
import MicIcon from '@mui/icons-material/Mic';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem('token'); // ✅ check authentication

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Practice', path: '/practice', icon: <MicIcon /> },
    { text: 'History', path: '/history', icon: <HistoryIcon /> },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', bgcolor: 'background.paper', height: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
        <GraphicEqIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          AI Coach
        </Typography>
      </Stack>
      <Divider />
      <List>
        {token && navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={NavLink} to={link.path}>
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      {token ? (
        <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ mx: 2 }}>
          Logout
        </Button>
      ) : (
        <Stack direction="column" spacing={2} sx={{ px: 2 }}>
          <Button component={NavLink} to="/login" variant="outlined" startIcon={<LoginIcon />}>
            Login
          </Button>
          <Button component={NavLink} to="/register" variant="contained">
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: '70px' }}>
          <Box
            component={NavLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            <GraphicEqIcon sx={{ color: 'primary.main', mr: 1, fontSize: '2rem' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
              AI Interview Coach
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {token && (
                <Stack direction="row" spacing={1} sx={{ mr: 3 }}>
                  {navLinks.map((link) => (
                    <Button
                      key={link.text}
                      component={NavLink}
                      to={link.path}
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        '&.active': { color: 'primary.main', fontWeight: 'bold' },
                      }}
                    >
                      {link.text}
                    </Button>
                  ))}
                </Stack>
              )}

              {token ? (
                <Button variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button component={NavLink} to="/login" sx={{ color: 'text.primary' }}>
                    Login
                  </Button>
                  <Button component={NavLink} to="/register" variant="contained" disableElevation>
                    Register
                  </Button>
                </Stack>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
