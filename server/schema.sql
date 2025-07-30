create schema if not exists portfolio_pulse;
use portfolio_pulse;

 CREATE TABLE `portfolio` (
   `id` int NOT NULL AUTO_INCREMENT,
   `amount` decimal(15,2) DEFAULT NULL,
   `name` varchar(45) DEFAULT NULL,
   `date` date NOT NULL DEFAULT (curdate()),
   `type` enum('stocks','mutual funds','gold','real estate','fixed deposits','bonds') NOT NULL,
   `quantity` decimal(15,5) DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `transaction` (
   `id` int NOT NULL AUTO_INCREMENT,
   `name` varchar(45) DEFAULT NULL,
   `amount` decimal(15,2) DEFAULT NULL,
   `tran_date` date DEFAULT (curdate()),
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `share_price` (
   `id` int NOT NULL AUTO_INCREMENT,
   `name` varchar(45) NOT NULL,
   `type` enum('stocks','mutual funds','gold','real estate','fixed deposits','bonds') NOT NULL,
   `price` decimal(15,5) NOT NULL,
   `update_date` date DEFAULT (curdate()),
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- 新增公司代码表
CREATE TABLE IF NOT EXISTS company_code (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stock_code VARCHAR(32),
  bond_code VARCHAR(32)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入五个知名公司及其股票、债券代码
INSERT INTO company_code (name, stock_code, bond_code) VALUES
('Tesla', 'TSLA', 'US88160RAC05'),
('Apple', 'AAPL', 'US037833AJ97'),
('Microsoft', 'MSFT', 'US594918BP81'),
('Amazon', 'AMZN', 'US023135BZ93'),
('Alphabet', 'GOOGL', 'US02079KAA25'),
('Meta Platforms', 'META', 'US30303MAB14'),    
('NVIDIA', 'NVDA', 'US67066GAA26'),
('Berkshire Hathaway', 'BRK.A', 'US084670BL16'),
('Johnson & Johnson', 'JNJ', 'US478160BG10'),
('Visa', 'V', 'US92826CAB76'),
('JPMorgan Chase', 'JPM', 'US46625HJD34'),
('Walmart', 'WMT', 'US931142DY36'),
('Procter & Gamble', 'PG', 'US742718EZ64'),
('UnitedHealth Group', 'UNH', 'US91324PDR16'),
('Exxon Mobil', 'XOM', 'US30231GBE01'),
('Mastercard', 'MA', 'US57636QAM19'),
('The Home Depot', 'HD', 'US437076BQ00'),
('Bank of America', 'BAC', 'US06051GGS36'),
('Coca-Cola', 'KO', 'US191216BP88'),
('Pfizer', 'PFE', 'US717081EB36');


INSER INTO share_price (name, type, price) VALUES ('Tesla', 'bonds', 15.11);