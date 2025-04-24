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
import ProductList from './Components/ProductList';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cart from './Components/Cart';
import Wishlist from './Components/Wishlist';
import ProductPage from './Components/ProductPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      console.log("Working");
      try {
        const res = await axios.get('http://localhost:8000/auth/check-auth', { withCredentials: true });
        if (res.data.isLoggedIn) {
          console.log("Logged in");
          setIsLoggedIn(true);
          setUser(res.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
        console.log(err);
      }
    };
    checkLogin();
  }, [isLoggedIn]);

  return (
    <Router> {/* Wrap everything inside BrowserRouter */}
    <ToastContainer 
        limit={3}
        autoClose={3000}
      />
      <HeaderMenu isLoggedIn={isLoggedIn} user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>
      <Routes>
          {/* <Route path='/' element={<HomePage />} /> */}
          <Route path='/' element={<UserHomePage />} />
          {/* register paths */}
          <Route path='/sellerReg' element={<SellerRegister />} />
          <Route path='/customerReg' element={<CustomerRegister />} />
          <Route path='/adminReg' element={<AdminRegistration />} />

          {/* login paths */}
          <Route path='/userLogin' element={<UserLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path='/sellerLog' element={<SellerLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path='/customerLog' element={<CustomerLogin />} />
          <Route path='/adminLog' element={<AdminLogin />} />
          <Route path='/sellerDash' element={<SellerDashboard />} />
          <Route path='/allSellerDetails' element={<SellerList />} />
          <Route path='/pendingSellers' element={<PendingSellersList />} />

          <Route path='/adminLog' element={<AdminLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
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
          <Route path="/find/:searchedProduct" element={<ProductList />} />
          <Route path="/visit/:productId" element={<ProductPage isLoggedIn={isLoggedIn} user={user} />} />
          <Route path='/cart' element={<Cart isLoggedIn={isLoggedIn} user={user} />} />
          <Route path='/wishlist' element={<Wishlist isLoggedIn={isLoggedIn} user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
