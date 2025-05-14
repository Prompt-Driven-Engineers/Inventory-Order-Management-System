import axios from "axios";

export const fetchAdminDetails = async(setAdmin) => {
    axios.get(`http://localhost:8000/admins/adminDetails`, {
        withCredentials: true
    })
    .then((res) => {
        setAdmin(res.data); // Store only the response data
        console.log(res.data); // Log actual data
    })
    .catch((err) => {
        console.error("Error fetching admin:", err);
        setAdmin(null); // Ensure state is handled on error
    });
}