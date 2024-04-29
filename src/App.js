import './App.css';
import { RelatedNews } from './components/RelatedNews';
import  CryptoTable  from './components/CryptoTable';
import { Container } from '@mui/material';
function App() {
  return (
    <Container>
      <CryptoTable/>
      <RelatedNews/>
    </Container>
  );
}

export default App;
