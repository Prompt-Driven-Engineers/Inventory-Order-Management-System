import axios from "axios";
import { replace } from "react-router-dom";

export const fetchCustomer = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/customers/customerDetails`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching customer:", err);
    return null;
  }
};

export const handleLogout = async (setIsLoggedIn, setUser, navigate) => {
  try {
    await axios.post('http://localhost:8000/auth/logout', {}, { withCredentials: true });
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/userLogin';
  } catch (err) {
    console.error('Logout failed:', err);
  }
}

export const fetchAllCustomer = async () => {
  try {
    const response = await axios.get('http://localhost:8000/customers/customerList', {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return null;
  }
};