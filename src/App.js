import './App.css';
import { RelatedNews } from './components/RelatedNews';
import  CryptoTable  from './components/CryptoTable';
import { Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Switch } from '@mui/material';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Switch checked={darkMode} onChange={handleThemeChange} />
        <CryptoTable />
        <RelatedNews />
      </Container>
    </ThemeProvider>
  );
}

export default App;
