create schema if not exists portfolio_pulse;
use portfolio_pulse;


 
--  CREATE TABLE `portfolio` (
--    `id` int NOT NULL AUTO_INCREMENT,
--    `amount` decimal(15,2) DEFAULT NULL,
--    `asset` varchar(45) DEFAULT NULL,
--    `name` varchar(45) DEFAULT NULL,
--    `create_date` date NULL DEFAULT (curdate()),
--    PRIMARY KEY (`id`)
--  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 



insert into portfolio (amount, asset, name, create_date) values 
(1500, 'bond', 'tesla', '2023-01-01'),
(200, 'bond', 'tesla', '2023-02-01'),
(310, 'bond', 'tesla', '2023-03-01'),
(1100, 'bond', 'tesla', '2023-04-01'),
(5030, 'bond', 'tesla', '2023-05-01'),
(700, 'bond', 'tesla', '2023-06-01'),
(300, 'bond', 'tesla', '2023-07-01'),
(2010, 'bond', 'tesla', '2023-08-01'),
(9100, 'bond', 'tesla', '2023-09-01'),
(1050, 'bond', 'tesla', '2023-10-01'),
(3004, 'bond', 'tesla', '2023-11-01'),
(6001, 'bond', 'tesla', '2023-12-01');

insert into portfolio (amount, asset, name, create_date) values 
(1200, 'real estate', 'bulter', '2023-01-01'),
(2020, 'real estate', 'bulter', '2023-02-01'),
(3120, 'real estate', 'bulter', '2023-03-01'),
(1100, 'real estate', 'bulter', '2023-04-01'),
(4030, 'real estate', 'bulter', '2023-05-01'),
(7600, 'real estate', 'bulter', '2023-06-01'),
(370, 'real estate', 'bulter', '2023-07-01'),
(210, 'real estate', 'bulter', '2023-08-01'),
(100, 'real estate', 'bulter', '2023-09-01'),
(50, 'real estate', 'bulter', '2023-10-01'),
(3204, 'real estate', 'bulter', '2023-11-01'),
(3001, 'real estate', 'bulter', '2023-12-01');

insert into portfolio (amount, asset, name, create_date) values (10000, 'cash', 'cashy', '2023-01-01')

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
('Alphabet', 'GOOGL', 'US02079KAA25');
INSERT INTO company_code (name, stock_code, bond_code) VALUES
('Meta Platforms', 'META', 'US30303MAB14'),         -- Facebook
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
