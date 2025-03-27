import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SellerRegister from './Components/SellerRegister';
import HomePage from './Components/HomePage';
import SellerLogin from './Components/SellerLogin';
import SellerDashboard from './Components/SellerDashboard';
import AddProduct from './Components/AddProductPage';

function App() {
  return (
    <Router> {/* Wrap everything inside BrowserRouter */}
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/sellerReg' element={<SellerRegister />} />
          <Route path='/sellerLog' element={<SellerLogin />} />
          <Route path='/sellerDash' element={<SellerDashboard />} />
          <Route path='/addProduct' element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
