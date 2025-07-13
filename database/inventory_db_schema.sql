-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: inventory_db
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `AddressID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `Landmark` varchar(255) DEFAULT NULL,
  `Street` varchar(255) NOT NULL,
  `City` varchar(100) NOT NULL,
  `State` varchar(100) NOT NULL,
  `Country` varchar(100) NOT NULL,
  `Zip` varchar(10) NOT NULL,
  `AddressType` varchar(100) NOT NULL,
  PRIMARY KEY (`AddressID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `adminpasswords`
--

DROP TABLE IF EXISTS `adminpasswords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminpasswords` (
  `PasswordHash` varchar(255) NOT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `PasswordStatus` enum('Active','Technical Support Required') DEFAULT 'Active',
  `UserID` int NOT NULL,
  PRIMARY KEY (`UserID`),
  CONSTRAINT `adminpasswords_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `AdminID` varchar(11) NOT NULL,
  `UserID` int NOT NULL,
  `Role` enum('SuperAdmin','Customer Support','Seller Administrator','Finance Administrator','Inventory Administrator') NOT NULL,
  `AccountStatus` enum('Active','Inactive','Suspended') DEFAULT 'Active',
  `AdharID` varchar(20) NOT NULL,
  `PANID` varchar(10) NOT NULL,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `UserID` (`UserID`),
  UNIQUE KEY `AdminID` (`AdminID`),
  UNIQUE KEY `AdharID` (`AdharID`),
  UNIQUE KEY `PANID` (`PANID`),
  CONSTRAINT `FK_admins_User` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `CartID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int NOT NULL,
  `SellerInventoryID` int NOT NULL,
  `Quantity` int NOT NULL DEFAULT '1',
  `AddedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`CartID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `SellerInventoryID` (`SellerInventoryID`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`SellerInventoryID`) REFERENCES `sellerinventory` (`SellerInventoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `CustomerID` int NOT NULL,
  `SubscriptionStatus` enum('Basic','Premium') DEFAULT 'Basic',
  `TotalOrders` int DEFAULT '0',
  `TotalSpent` decimal(10,2) DEFAULT '0.00',
  `Points` decimal(10,2) DEFAULT '3.00',
  `Status` enum('Active','Deactive','Ban') DEFAULT 'Active',
  PRIMARY KEY (`CustomerID`),
  CONSTRAINT `fk_customer_user` FOREIGN KEY (`CustomerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` text,
  `Category` varchar(100) NOT NULL,
  `Subcategory` varchar(100) NOT NULL,
  `Specifications` json NOT NULL,
  `images` json DEFAULT NULL,
  `Brand` varchar(100) DEFAULT NULL,
  `Status` enum('active','inactive','suspended') DEFAULT 'active',
  `Capacity` int DEFAULT '100',
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=40008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `OrderDetailID` int NOT NULL AUTO_INCREMENT,
  `OrderID` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Quantity` int NOT NULL,
  `SellerInventoryID` int NOT NULL,
  PRIMARY KEY (`OrderDetailID`),
  KEY `OrderID` (`OrderID`),
  KEY `orderdetails_ibfk_4` (`SellerInventoryID`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE,
  CONSTRAINT `orderdetails_ibfk_4` FOREIGN KEY (`SellerInventoryID`) REFERENCES `sellerinventory` (`SellerInventoryID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int NOT NULL,
  `ShippingAddressID` int NOT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `PaymentMethod` enum('COD','UPI','Credit Card','Debit Card','Net Banking','Wallet') NOT NULL,
  `OrderStatus` enum('Pending','Processing','Shipped','Delivered','Cancelled','Returned') DEFAULT 'Pending',
  `PaymentStatus` enum('Pending','Paid','Refunded','Failed') DEFAULT 'Pending',
  `OrderDate` date NOT NULL DEFAULT (curdate()),
  `PlacedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `ShippingAddressID` (`ShippingAddressID`),
  KEY `fk_orders_customer` (`CustomerID`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`ShippingAddressID`) REFERENCES `address` (`AddressID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `ReportID` int NOT NULL AUTO_INCREMENT,
  `GeneratedBy` int NOT NULL,
  `ReportType` varchar(50) NOT NULL,
  `ReportDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ReportData` json NOT NULL,
  PRIMARY KEY (`ReportID`),
  KEY `GeneratedBy` (`GeneratedBy`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`GeneratedBy`) REFERENCES `admins` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sellerinventory`
--

DROP TABLE IF EXISTS `sellerinventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellerinventory` (
  `SellerInventoryID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int NOT NULL,
  `SellerID` int NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Discount` int DEFAULT '0',
  `Quantity` int NOT NULL,
  `Status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `AddedBy` int DEFAULT NULL,
  `AddedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `PlatformCommission` decimal(7,2) DEFAULT '0.00',
  `CurrentStock` int NOT NULL,
  PRIMARY KEY (`SellerInventoryID`),
  KEY `ProductID` (`ProductID`),
  KEY `FK_SellerInventory_Admin` (`AddedBy`),
  KEY `FK_SellerInventory_Seller` (`SellerID`),
  CONSTRAINT `FK_SellerInventory_Admin` FOREIGN KEY (`AddedBy`) REFERENCES `admins` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `FK_SellerInventory_Seller` FOREIGN KEY (`SellerID`) REFERENCES `sellers` (`SellerID`) ON DELETE CASCADE,
  CONSTRAINT `sellerinventory_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `inventory` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sellers`
--

DROP TABLE IF EXISTS `sellers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellers` (
  `SellerID` int NOT NULL,
  `StoreName` varchar(255) NOT NULL,
  `StoreDetails` text,
  `PAN` varchar(10) NOT NULL,
  `IFSC` varchar(11) NOT NULL,
  `AccountNo` varchar(20) NOT NULL,
  `TotalSales` decimal(15,2) DEFAULT '0.00',
  `TotalOrdersFullfilled` int DEFAULT '0',
  `StoreRating` decimal(3,2) DEFAULT '0.00',
  `Status` enum('Active','Pending','Suspended') DEFAULT 'Pending',
  PRIMARY KEY (`SellerID`),
  UNIQUE KEY `PAN` (`PAN`),
  UNIQUE KEY `AccountNo` (`AccountNo`),
  CONSTRAINT `fk_seller_user` FOREIGN KEY (`SellerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `sellers_chk_1` CHECK ((`StoreRating` between 0 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sellerstock`
--

DROP TABLE IF EXISTS `sellerstock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellerstock` (
  `SellerStockID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int NOT NULL,
  `SellerID` int NOT NULL,
  `TotalStock` int NOT NULL,
  PRIMARY KEY (`SellerStockID`),
  KEY `ProductID` (`ProductID`),
  KEY `FK_SellerStock_Seller` (`SellerID`),
  CONSTRAINT `FK_SellerStock_Seller` FOREIGN KEY (`SellerID`) REFERENCES `sellers` (`SellerID`) ON DELETE CASCADE,
  CONSTRAINT `sellerstock_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `inventory` (`ProductID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sellerwarehousestock`
--

DROP TABLE IF EXISTS `sellerwarehousestock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellerwarehousestock` (
  `SellerWarehouseStockID` int NOT NULL AUTO_INCREMENT,
  `SellerInventoryID` int NOT NULL,
  `WarehouseID` int NOT NULL,
  `StockQuantity` int NOT NULL DEFAULT '0',
  `AddedBy` int DEFAULT NULL,
  `AddedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SellerWarehouseStockID`),
  KEY `SellerInventoryID` (`SellerInventoryID`),
  KEY `WarehouseID` (`WarehouseID`),
  KEY `AddedBy` (`AddedBy`),
  CONSTRAINT `sellerwarehousestock_ibfk_1` FOREIGN KEY (`SellerInventoryID`) REFERENCES `sellerinventory` (`SellerInventoryID`) ON DELETE CASCADE,
  CONSTRAINT `sellerwarehousestock_ibfk_2` FOREIGN KEY (`WarehouseID`) REFERENCES `warehouses` (`WarehouseID`) ON DELETE CASCADE,
  CONSTRAINT `sellerwarehousestock_ibfk_3` FOREIGN KEY (`AddedBy`) REFERENCES `admins` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `systemactivity`
--

DROP TABLE IF EXISTS `systemactivity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `systemactivity` (
  `ActivityID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `ActionType` varchar(50) NOT NULL,
  `AffectedTable` varchar(50) NOT NULL,
  `AffectedRecordID` int NOT NULL,
  `ActivityDescription` text NOT NULL,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `IPAddress` varchar(45) NOT NULL DEFAULT 'UNKNOWN',
  `DeviceInfo` varchar(255) NOT NULL DEFAULT 'UNKNOWN',
  PRIMARY KEY (`ActivityID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `systemactivity_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userpasswords`
--

DROP TABLE IF EXISTS `userpasswords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpasswords` (
  `UserID` int NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `PasswordStatus` enum('Active','Reset Required') DEFAULT 'Active',
  PRIMARY KEY (`UserID`),
  CONSTRAINT `userpasswords_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Phone` varchar(15) NOT NULL,
  `Phone2` varchar(15) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `FailedLoginAttempts` int DEFAULT '0',
  `LastLogin` datetime DEFAULT NULL,
  `EmailVerified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `Phone` (`Phone`),
  UNIQUE KEY `Phone2` (`Phone2`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usertypes`
--

DROP TABLE IF EXISTS `usertypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usertypes` (
  `RoleID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `UserType` enum('Customer','Seller','Admin','Warehouse Manager') NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RoleID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `usertypes_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehousemanagers`
--

DROP TABLE IF EXISTS `warehousemanagers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehousemanagers` (
  `ManagerID` int NOT NULL,
  `TotalOrderProcessed` int DEFAULT '0',
  `IsActive` enum('Active','Suspended') DEFAULT 'Active',
  `IncidentsFilled` int DEFAULT '0',
  `Performance` decimal(3,2) DEFAULT '4.00',
  `AddedBy` int DEFAULT NULL,
  PRIMARY KEY (`ManagerID`),
  KEY `FK_WarehouseManagers_Admin` (`AddedBy`),
  CONSTRAINT `fk_manager_user` FOREIGN KEY (`ManagerID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `FK_WarehouseManagers_Admin` FOREIGN KEY (`AddedBy`) REFERENCES `admins` (`UserID`) ON DELETE SET NULL,
  CONSTRAINT `warehousemanagers_chk_1` CHECK ((`Performance` between 0 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouses`
--

DROP TABLE IF EXISTS `warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouses` (
  `WarehouseID` int NOT NULL AUTO_INCREMENT,
  `ManagerID` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Location` json NOT NULL,
  `ZIP` varchar(10) NOT NULL,
  `ContactNo` varchar(15) NOT NULL,
  `Status` enum('Active','Under Maintenance','InActive') DEFAULT 'Active',
  PRIMARY KEY (`WarehouseID`),
  KEY `fk_warehouses_manager` (`ManagerID`),
  CONSTRAINT `fk_warehouses_manager` FOREIGN KEY (`ManagerID`) REFERENCES `warehousemanagers` (`ManagerID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehousestock`
--

DROP TABLE IF EXISTS `warehousestock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehousestock` (
  `StockID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int NOT NULL,
  `warehouseID` int NOT NULL,
  `Stock` int NOT NULL,
  `ReorderLevel` int NOT NULL,
  PRIMARY KEY (`StockID`),
  KEY `ProductID` (`ProductID`),
  KEY `warehouseID` (`warehouseID`),
  CONSTRAINT `warehousestock_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `inventory` (`ProductID`) ON DELETE CASCADE,
  CONSTRAINT `warehousestock_ibfk_2` FOREIGN KEY (`warehouseID`) REFERENCES `warehouses` (`WarehouseID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `WishlistID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int NOT NULL,
  `ProductID` int NOT NULL,
  `SellerInventoryID` int DEFAULT NULL,
  `AddedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`WishlistID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `ProductID` (`ProductID`),
  KEY `SellerInventoryID` (`SellerInventoryID`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `inventory` (`ProductID`),
  CONSTRAINT `wishlist_ibfk_3` FOREIGN KEY (`SellerInventoryID`) REFERENCES `sellerinventory` (`SellerInventoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-13 20:43:51
