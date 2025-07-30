create schema if not exists portfolio_pulse;
use portfolio_pulse;

 CREATE TABLE `portfolio` (
   `id` int NOT NULL AUTO_INCREMENT,
   `amount` decimal(15,2) DEFAULT NULL,
   `name` varchar(45) DEFAULT NULL,
   `date` date NOT NULL DEFAULT (curdate()),
   `type` enum('stocks','mutual funds','gold','real estate','fixed deposite','bonds') NOT NULL,
   `quantity` decimal(15,5) DEFAULT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `transaction` (
   `id` int NOT NULL AUTO_INCREMENT,
   `name` varchar(45) DEFAULT NULL,
   `amount` decimal(15,2) DEFAULT NULL,
   `tran_date` date DEFAULT (curdate()),
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `share_price` (
   `id` int NOT NULL AUTO_INCREMENT,
   `name` varchar(45) NOT NULL,
   `type` enum('stocks','mutual funds','gold','real estate','fixed deposite','bonds') NOT NULL,
   `price` decimal(15,5) NOT NULL,
   `update_date` date DEFAULT (curdate()),
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 新增公司代码表
CREATE TABLE IF NOT EXISTS company_code (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stock_code VARCHAR(32),
  bond_code VARCHAR(32)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入五个知名公司及其股票、债券代码
INSERT INTO company_code (name, stock_code, bond_code) VALUES
('tesla', 'tsla', 'US88160RAC05'),
('apple', 'aapl', 'US037833AJ97'),
('microsoft', 'msft', 'US594918BP81'),
('amazon', 'amzn', 'US023135BZ93'),  
('nvidia', 'nvda', 'US67066GAA26');


-- INSERT INTO share_price (name, type, price) VALUES ('tesla', 'bonds', 15.11);