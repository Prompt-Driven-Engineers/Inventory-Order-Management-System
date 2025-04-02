import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SellerRegister from './Components/SellerRegister';
import HomePage from './Components/HomePage';
import SellerLogin from './Components/SellerLogin';
import SellerDashboard from './Components/SellerDashboard';
import CustomerLogin from './Components/CustomerLogin';
import CustomerRegister from './Components/CustomerRegister';
import AddProduct from './Components/AddProductPage';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';

function App() {
  return (
    <Router> {/* Wrap everything inside BrowserRouter */}
      <Routes>
          <Route path='/' element={<HomePage />} />
          {/* register paths */}
          <Route path='/sellerReg' element={<SellerRegister />} />
          <Route path='/customerReg' element={<CustomerRegister />} />

          {/* login paths */}
          <Route path='/sellerLog' element={<SellerLogin />} />
          <Route path='/customerLog' element={<CustomerLogin />} />
          <Route path='/sellerDash' element={<SellerDashboard />} />
          <Route path='/adminLog' element={<AdminLogin />} />
          <Route path='/adminDash' element={<AdminDashboard />} />
          {/* other paths */}
          <Route path='/addProduct' element={<AddProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
