import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import SellerRegister from './Components/SellerRegister';
import HomePage from './pages/HomePage';
import SellerLogin from './Components/SellerLogin';
import SellerDashboard from './Components/SellerDashboard';
import CustomerRegister from './Components/CustomerRegister';
import AddProduct from './Components/AddProductPage';
import AdminDashboard from './Components/AdminDashboard';
import AdminRegistration from './Components/AdminRegistration';
import AdminDetails from './Components/AdminDetails';
import ModifyAdmin from './Components/ModifyAdmin';
import SellerList from './Components/SellerList';
import PendingSellersList from './Components/PendingSellersList';
import AllProductsList from './Components/AllProductsList';
import CustomerDashboard from './Components/CustomerDashboard';
import UserHomePage from './Components/UserHomePage';
import HeaderMenu from './Components/HeaderMenu';
import UserLogin from './pages/UserLogin';
import ProductSearch from './Components/ProductSearch';
import { toast, ToastContainer } from 'react-toastify';
import ProductList from './Components/ProductList';
import { useEffect, useState } from 'react';
import axios from "axios";
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import ProductPage from './pages/ProductPage';
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

  const PrivateRoute = ({ isLoggedIn }) => {
    const location = useLocation();
    useEffect(() => {
      if (!isLoggedIn && location.pathname === '/cart') toast.info('Please login to access your cart');
    }, [isLoggedIn, location.pathname]);

    return isLoggedIn ? (
      <Outlet />
    ) : (
      <Navigate to="/userLogin" replace state={{ from: location }} />
    );
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
          {/* ------------------------------ General paths ------------------------------ */}
          {/* <Route path='/advanceHome' element={<HomePage />} /> */}
          <Route path='/' element={<UserHomePage />} />
          <Route path="/find/:searchedProduct" element={<ProductList />} />
          <Route path="/visit/:productId" element={<ProductPage isLoggedIn={isLoggedIn} user={user} />} />

          {/* ------------------------------ Register paths ------------------------------ */}
          <Route path='/sellerReg' element={<SellerRegister />} />
          <Route path='/customerReg' element={<CustomerRegister />} />
          <Route path='/adminReg' element={<AdminRegistration />} />

          {/* ------------------------------ Login paths ------------------------------ */}
          <Route path='/userLogin' element={<UserLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          {/* <Route path='/whmlog' element={<WHMlogin />} /> */}

          {/* Protected routes */}
          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>

            {/* ------------------------------ DashBoards ------------------------------ */}
            <Route path='/adminDash' element={<AdminDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
            <Route path='/sellerDash' element={<SellerDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
            <Route path='/customerDash' element={<CustomerDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
            {/* <Route path='/whmDash' element={<WHMDashBoard />} /> */}

            {/* ------------------------------ User actions  ------------------------------*/}
            <Route path='/cart' element={<Cart isLoggedIn={isLoggedIn} user={user} />}/>
            <Route path='/wishlist' element={<Wishlist isLoggedIn={isLoggedIn} user={user} />} />
            <Route path="/orderProduct" element={<OrderPage isLoggedIn={isLoggedIn} user={user} />} />
            <Route path='/ordersPage' element={<OrdersPage />} />

            {/* ------------------------------ Seller actions ------------------------------ */}
            <Route path='/searchProduct' element={<ProductSearch />} />     {/* Search product to add */}
            <Route path='/addProduct' element={<AddProduct />} />
            <Route path='/sellerOrders' element={<SellerOrdersPage/>} />

            {/* ------------------------------ Admin actions ------------------------------ */}
            {/* Super Admin access */}
            <Route path='/adminList' element={<AdminDetails />} />
            <Route path='/modAdmin' element={<ModifyAdmin />} />

            {/* Seller Admin access */}
            <Route path='/allSellerDetails' element={<SellerList />} />
            <Route path='/pendingSellers' element={<PendingSellersList />} />
            <Route path='/sellsList' element={<SellsDashboard />} />
            <Route path='/sellerInventory' element={<SellerInventory />} />
            
            {/* Customer Support access */}
            <Route path='/allCustomers' element={<CustomerList />} />

            {/* ------------------------------ other paths ------------------------------ */}
            <Route path='/allProduct' element={<AllProductsList />} />
            <Route path='/reorderList' element={<ReOrderList />} />

          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
