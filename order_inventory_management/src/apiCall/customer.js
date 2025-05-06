import axios from "axios";

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
  