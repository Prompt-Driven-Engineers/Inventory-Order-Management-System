import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import SellerRegister from './Components/SellerRegister';
import HomePage from './pages/HomePage';
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
import UserLogin from './pages/UserLogin';
import ProductSearch from './Components/ProductSearch';
import { toast, ToastContainer } from 'react-toastify';
import ProductList from './Components/ProductList';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductPage from './Components/ProductPage';
import OrderPage from './Components/OrderPage';
import CustomerList from './pages/CustomerList';
import SellerInventory from './pages/SellerInventory';
import OrdersPage from './Components/OrdersPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import ReOrderList from './Components/ReOrderList';
import SellsDashboard from './pages/SellsDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('http://localhost:8000/auth/check-auth', { withCredentials: true });
        if (res.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(res.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkLogin();
  }, [isLoggedIn]);

  const PrivateRoute = ({children, isLoggedIn}) => {
    const location = useLocation();
    console.log(location);
    if(!isLoggedIn && location.pathname === '/cart') toast.info("Please login to access your cart");
    return isLoggedIn ? children : (<Navigate to='/userLogin' state={{ from: location }} replace />)
  }

  return (
    <Router>
      <ToastContainer
        limit={3}
        autoClose={3000}
      />
      <HeaderMenu isLoggedIn={isLoggedIn} user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      <div className='pt-[64px]'>
        <Routes>
          <Route path='/advanceHome' element={<HomePage />} />
          <Route path='/' element={<UserHomePage />} />
          {/* register paths */}
          <Route path='/sellerReg' element={<SellerRegister />} />
          <Route path='/customerReg' element={<CustomerRegister />} />
          <Route path='/adminReg' element={<AdminRegistration />} />

          {/* login paths */}
          <Route path='/userLogin' element={<UserLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          {/* <Route path='/sellerLog' element={<SellerLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          {isLoggedIn ? <Route path='/customerLog' element={<HomePage />} />
            : <Route path='/customerLog' element={<CustomerLogin />} />
          } */}
          {/* <Route path='/adminLog' element={<AdminLogin />} /> */}
          <Route path='/sellerDash' element={<SellerDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path='/allSellerDetails' element={<SellerList />} />
          <Route path='/pendingSellers' element={<PendingSellersList />} />
          
          <Route path='/allCustomers' element={<CustomerList />} />

          {/* <Route path='/adminLog' element={<AdminLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} /> */}
          <Route path='/adminDash' element={<AdminDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path='/adminList' element={<AdminDetails />} />
          <Route path='/modAdmin' element={<ModifyAdmin />} />
          {/* <Route path='/whmlog' element={<WHMlogin />} /> */}

          {/* DashBoards */}
          <Route path='/adminDash' element={<AdminDashboard />} />
          <Route path='/sellerDash' element={<SellerDashboard />} />
          <Route path='/customerDash' element={<CustomerDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path='/whmDash' element={<WHMDashBoard />} />

          {/* other paths */}
          <Route path='/addProduct' element={<AddProduct />} />
          <Route path='/allProduct' element={<AllProductsList />} />
          <Route path='/sellerInventory' element={<SellerInventory />} />
          <Route path='/ordersPage' element={<OrdersPage />} />
          <Route path='/sellerOrders' element={<SellerOrdersPage/>} />
          <Route path='/reorderList' element={<ReOrderList />} />
          <Route path='/sellsList' element={<SellsDashboard />} />

          <Route path='/searchProduct' element={<ProductSearch />} />
          <Route path="/find/:searchedProduct" element={<ProductList />} />
          <Route path="/visit/:productId" element={<ProductPage isLoggedIn={isLoggedIn} user={user} />} />
          <Route path='/cart' element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Cart isLoggedIn={isLoggedIn} user={user} />
            </PrivateRoute>} 
          />
          <Route path='/wishlist' element={<Wishlist isLoggedIn={isLoggedIn} user={user} />} />
          <Route path="/orderProduct" element={<OrderPage isLoggedIn={isLoggedIn} user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
