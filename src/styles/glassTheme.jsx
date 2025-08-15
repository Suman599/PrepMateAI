import { createTheme } from '@mui/material/styles';

const glassTheme = createTheme({
  palette: {
    mode: 'light', // change to 'dark' for dark theme
    primary: {
      main: '#00bcd4',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '16px',
        },
      },
    },
  },
});

export default glassTheme;
