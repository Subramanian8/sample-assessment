-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2018 at 03:00 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `emoschema`
--

-- --------------------------------------------------------

--
-- Table structure for table `itemlist`
--

CREATE TABLE IF NOT EXISTS `itemlist` (
  `Name` varchar(20) NOT NULL,
  `Price` int(10) NOT NULL,
  `Weight` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `itemlist`
--

INSERT INTO `itemlist` (`Name`, `Price`, `Weight`) VALUES
('Item 1', 10, 200),
('Item 2', 100, 20),
('Item 3', 30, 300),
('Item 4', 20, 500),
('Item 5', 30, 250),
('Item 6', 40, 10),
('Item 7', 200, 10),
('Item 8', 120, 500),
('Item 9', 130, 790),
('Item 10', 20, 100),
('Item 11', 10, 340),
('Item 12', 4, 800),
('Item 13', 5, 200),
('Item 14', 240, 20),
('Item 15', 123, 700),
('Item 16', 245, 10),
('Item 17', 230, 20),
('Item 18', 110, 200),
('Item 19', 45, 200),
('Item 20', 67, 20),
('Item 21', 88, 300),
('Item 22', 10, 500),
('Item 23', 17, 250),
('Item 24', 19, 10),
('Item 25', 89, 10),
('Item 26', 45, 500),
('Item 27', 99, 790),
('Item 28', 125, 100),
('Item 29', 198, 340),
('Item 30', 220, 800),
('Item 31', 249, 200),
('Item 32', 230, 20),
('Item 33', 190, 700),
('Item 34', 45, 10),
('Item 35', 12, 20),
('Item 36', 5, 200),
('Item 37', 2, 200),
('Item 38', 90, 20),
('Item 39', 12, 300),
('Item 40', 167, 500),
('Item 41', 12, 250),
('Item 42', 8, 10),
('Item 43', 2, 10),
('Item 44', 9, 500),
('Item 45', 210, 790),
('Item 46', 167, 100),
('Item 47', 23, 340),
('Item 48', 190, 800),
('Item 49', 199, 200),
('Item 50', 12, 20);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
