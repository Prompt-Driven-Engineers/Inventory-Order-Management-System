const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();

const sellerRouter = require('./Routes/SellerRoutes');
const adminRouter = require('./Routes/AdminRoutes');
const productRouter = require('./Routes/ProductRoutes');
const customerRouter = require('./Routes/CustomerRoutes');
const AuthnRouter = require('./Routes/AuthRoutes');

app.use(express.json()); // to parse JSON request body
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //  Parses form data
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // If you're using cookies or authentication
}));

app.use('/sellers', sellerRouter);
app.use('/admins', adminRouter);
app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/auth', AuthnRouter);

app.get('/', (req, res) => {
    res.send("Hellow from backend");
});


app.listen(8000, () => {
    console.log('Server started');
});