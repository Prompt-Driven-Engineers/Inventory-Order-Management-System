# 🛒 Inventory-Order-Management-System

A multi-vendor E-commerce Inventory and Order Management System built with **React**, **Node.js**, **Express.js**, **MySQL**, and **Tailwind CSS**.  
This platform helps manage inventory, track orders, and streamline operations for users, sellers, and administrators.

---

## 🚀 Features

### 👤 User Module
- Register and login
- Browse products
- Add to **cart** or **wishlist**
- Place orders (currently supports **Cash on Delivery** only)

### 🛍️ Seller Module
- Register and wait for admin approval
- Login to seller dashboard
- Add and manage products
- Monitor order status for their products

### 🔧 Admin Module
- **Super Admin**
  - Register and manage other admins
  - Approve/reject seller registrations
  - Full access to system operations

- **Other Admin Roles**
  - **Seller Admin**: Manages seller-related operations
  - **Customer Support**: Handles customer issues and requests

---

## 🛠️ Tech Stack

| Frontend       | Backend          | Database | Styling       |
|----------------|------------------|----------|----------------|
| React          | Node.js          | MySQL    | Tailwind CSS   |
| React Router   | Express.js       |          |                |

---

## 📁 Project Structure

```
root/
├── backend/                       # Backend: Node.js + Express + MySQL
│   ├── server.js                 # Entry point
│   ├── Routes/                  # API routes
│   ├── db/                      # DB connection config
│   ├── Authentication/          # Auth logic
│   └── Controllers/             # Business logic
├── order_inventory_management/   # Frontend: React + Tailwind
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.js
├── database/                     # MySQL DB schema
│   └── inventory_db_schema.sql
└── README.md
```

---

## ⚙️ Getting Started

### 🗃️ Database Setup

1. Create a MySQL database (e.g., `inventory_db`)
2. Import the schema file:

```bash
mysql -u root -p inventory_db < database/inventory_db_schema.sql
```
---

## 🔐 Admin Setup Instructions (Important)

To enhance security, the **initial Super Admin** must be added manually through the database.  
This ensures top-level access is never exposed through public registration.

---

### 🛠️ Steps to Add Super Admin Manually:

1. **Insert into `users` table**  
   Add user details like name, email, and a securely hashed password.

2. **Get the generated `userID`**

3. **Use that `userID` to insert into the following tables:**

   - ### 🔹 `admins`
     Must include a unique `AdminID` that follows this **exact format**:

     ```
     ADM22KD80AH
     ```

     ✅ Format rules:
     - Exactly **11 characters**
     - Begins with `ADM`
     - Followed by:
       - 2 digits
       - 2 uppercase letters
       - 2 digits
       - 2 uppercase letters  
     ✅ Example: `ADM23XY45AZ`

   - ### 🔹 `adminsPasswords`
     - Store the hashed password and link it to the `userID`

   - ### 🔹 `address`
     - Optional but recommended for admin profile completion

   - ### 🔹 `usertypes`
     - Assign the user type as `Admin` (based on your schema)

---

> 🔐 Only the **first Super Admin** must be created manually.  
> After that, Super Admins can log in and use the platform to:
> - Approve sellers
> - Register other admins (e.g., Seller Admins, Customer Support roles)

---

### 🔙 Backend Setup

```bash
cd backend
npm install
nodemon server
```

---

### 💻 Frontend Setup

```bash
cd order_inventory_management
npm install
npm run dev
```

---

## 📌 Notes

- Payment gateway not integrated — orders currently use **Cash on Delivery (COD)**
- Admin approval is required for seller accounts before login
- Future scope:
  - Payment gateway integration
  - Real-time order tracking
  - Analytics dashboard
  - Notifications (email/SMS)

---

## 📄 License

This project is intended for educational and demo purposes.  
Feel free to extend or customize it as per your needs.

---

## 📷 Screenshots

### 🏠 Homepage
![Homepage](https://github.com/user-attachments/assets/558cd427-da64-4f5e-8e3f-32ed3238e1be)

### 🛍️ Product Search / Listing
![Product Search / Listing](https://github.com/user-attachments/assets/9ae03798-c6ed-46d5-9b09-0c0acb232601)

### 📦 Product Details
![Product Details](https://github.com/user-attachments/assets/c5c20014-ec2e-42f7-8221-98515faa2b70)

### ⚙️ Registration
![Registration](https://github.com/user-attachments/assets/2e9d3552-e70d-4885-968d-f3032e38bd86)

### 🔍 Login
![Login](https://github.com/user-attachments/assets/cfb38ed1-5be0-4774-8a02-c8fbf33cbad3)

### 🧾 User Dashboard
![User Dashboard](https://github.com/user-attachments/assets/f3f52c5a-2eec-4011-abd2-fa95b669f95b)

### 🛒 Wishlist View
![Wishlist View](https://github.com/user-attachments/assets/7ce64dcb-8b12-403b-9949-6c44dc164a48)

### 👤 Order
![Order](https://github.com/user-attachments/assets/5cb7b3c4-8a90-49cb-80c9-d757a93fd276)
