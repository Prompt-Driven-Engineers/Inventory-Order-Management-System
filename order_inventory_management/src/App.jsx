import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import SellerRegister from './Components/SellerRegister';
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
import { UserContext } from './Context/UserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/check-auth", { withCredentials: true });
        if (res.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(res.data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setChecking(false);
      }
    };

    checkLogin();
  }, [isLoggedIn]);

  if (checking) return <p>Loading...</p>;

  const PrivateRoute = () => {
    const location = useLocation();
    useEffect(() => {
      if (!isLoggedIn && location.pathname === '/cart') toast.info('Please login to access your cart');
    }, [isLoggedIn, location.pathname]);

    return isLoggedIn ? (
      <Outlet />
    ) : (
      <Navigate to="/userLogin" replace state={{ from: location }} />
    );
  };

  return (
    <Router>
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
        <ToastContainer
          limit={3}
          autoClose={3000}
        />
        <HeaderMenu />
        <div className='pt-[64px]'>
          <Routes>
            {/* ------------------------------ General paths ------------------------------ */}
            {/* <Route path='/advanceHome' element={<HomePage />} /> */}
            <Route path='/' element={<UserHomePage />} />
            <Route path="/find/:searchedProduct" element={<ProductList />} />
            <Route path="/visit/:productId" element={<ProductPage />} />

            {/* ------------------------------ Register paths ------------------------------ */}
            <Route path='/sellerReg' element={<SellerRegister />} />
            <Route path='/customerReg' element={<CustomerRegister />} />
            <Route path='/adminReg' element={<AdminRegistration />} />

            {/* ------------------------------ Login paths ------------------------------ */}
            <Route path='/userLogin' element={<UserLogin />} />
            {/* <Route path='/whmlog' element={<WHMlogin />} /> */}

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>

              {/* ------------------------------ DashBoards ------------------------------ */}
              <Route path='/adminDash' element={<AdminDashboard />} />
              <Route path='/sellerDash' element={<SellerDashboard />} />
              <Route path='/customerDash' element={<CustomerDashboard />} />
              {/* <Route path='/whmDash' element={<WHMDashBoard />} /> */}

              {/* ------------------------------ User actions  ------------------------------*/}
              <Route path='/cart' element={<Cart />} />
              <Route path='/wishlist' element={<Wishlist />} />
              <Route path="/orderProduct" element={<OrderPage />} />
              <Route path='/ordersPage' element={<OrdersPage />} />

              {/* ------------------------------ Seller actions ------------------------------ */}
              <Route path='/searchProduct' element={<ProductSearch />} />     {/* Search product to add */}
              <Route path='/addProduct' element={<AddProduct />} />
              <Route path='/sellerOrders' element={<SellerOrdersPage />} />

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
      </UserContext.Provider>
    </Router>
  );
}

export default App;
