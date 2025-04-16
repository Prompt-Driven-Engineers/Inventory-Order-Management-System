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
import AdminRegistration from './Components/AdminRegistration';
import AdminDetails from './Components/AdminDetails';
import ModifyAdmin from './Components/ModifyAdmin';
import SellerList from './Components/SellerList';
import WHMlogin from './Components/WHMlogin';
import WHMDashBoard from './Components/WHMDashBoard';
import PendingSellersList from './Components/PendingSellersList';
import AllProductsList from './Components/AllProductsList';
import CustomerDashboard from './Components/CustomerDashboard';
import UserHomePage from './Components/UserHomePage';
import HeaderMenu from './Components/HeaderMenu';
import UserLogin from './Components/UserLogin';
import ProductSearch from './Components/ProductSearch';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router> {/* Wrap everything inside BrowserRouter */}
    <ToastContainer 
        limit={3}
        autoClose={2000}
      />
    <HeaderMenu />
      <Routes>
          {/* <Route path='/' element={<HomePage />} /> */}
          <Route path='/' element={<UserHomePage />} />
          {/* register paths */}
          <Route path='/sellerReg' element={<SellerRegister />} />
          <Route path='/customerReg' element={<CustomerRegister />} />
          <Route path='/adminReg' element={<AdminRegistration />} />

          {/* login paths */}
          <Route path='/userLogin' element={<UserLogin />} />
          <Route path='/sellerLog' element={<SellerLogin />} />
          <Route path='/customerLog' element={<CustomerLogin />} />
          <Route path='/adminLog' element={<AdminLogin />} />
          <Route path='/sellerDash' element={<SellerDashboard />} />
          <Route path='/allSellerDetails' element={<SellerList />} />
          <Route path='/pendingSellers' element={<PendingSellersList />} />

          <Route path='/adminLog' element={<AdminLogin />} />
          <Route path='/adminDash' element={<AdminDashboard />} />
          <Route path='/adminList' element={<AdminDetails />} />
          <Route path='/modAdmin' element={<ModifyAdmin />} />
          <Route path='/whmlog' element={<WHMlogin />} />

          {/* DashBoards */}
          <Route path='/adminDash' element={<AdminDashboard />} />
          <Route path='/sellerDash' element={<SellerDashboard />} />
          <Route path='/customerDash' element={<CustomerDashboard />} />
          <Route path='/whmDash' element={<WHMDashBoard />} />

          {/* other paths */}
          <Route path='/addProduct' element={<AddProduct />} />
          <Route path='/allProduct' element={<AllProductsList />} />

          <Route path='/searchProduct' element={<ProductSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
