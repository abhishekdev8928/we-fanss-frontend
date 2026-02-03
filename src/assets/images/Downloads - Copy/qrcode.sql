-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 22, 2025 at 07:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lotus-live`
--

-- --------------------------------------------------------

--
-- Table structure for table `qrcode`
--

CREATE TABLE `qrcode` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `unique_code` varchar(50) NOT NULL,
  `activation_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `pdf` varchar(255) DEFAULT NULL,
  `pdf_url` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `file_url` text DEFAULT NULL,
  `link` text DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdBy` int(11) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `qrcode`
--

INSERT INTO `qrcode` (`id`, `title`, `unique_code`, `activation_date`, `expiry_date`, `pdf`, `pdf_url`, `content`, `file`, `file_url`, `link`, `status`, `createdBy`, `createdDate`, `url`) VALUES
(1, 'tt', '3F3AFAFD', '2025-12-23', '2025-12-27', '6c2d594095210ac5d7918320beda3359_1.pdf', 'http://localhost/Rajashri/lotus-live/uploads/QRPdf/6c2d594095210ac5d7918320beda3359_1.pdf', 'http://localhost/Rajashri/lotus-live/qrcode/scan/3F3AFAFD', '03349b42f7b255fa8c3337b70b104290.png', 'http://localhost/Rajashri/lotus-live/uploads/qrcode/03349b42f7b255fa8c3337b70b104290.png', 'http://localhost/Rajashri/lotus-live/qrcode/scan/3F3AFAFD', 1, 1, '2025-12-22 11:30:32', 'tt');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `qrcode`
--
ALTER TABLE `qrcode`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_code` (`unique_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `qrcode`
--
ALTER TABLE `qrcode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
