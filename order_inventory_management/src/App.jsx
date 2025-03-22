import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SellerRegister from './Components/SellerRegister';
import HomePage from './Components/HomePage';
import SellerLogin from './Components/SellerLogin';
import SellerDashboard from './Components/SellerDashboard';

function App() {
  return (
    <Router> {/* Wrap everything inside BrowserRouter */}
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/sellerReg' element={<SellerRegister />} />
          <Route path='/sellerLog' element={<SellerLogin />} />
          <Route path='/sellerDash/:UserID' element={<SellerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
