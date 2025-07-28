create schema if not exists portfolio_pulse;
use portfolio_pulse;

-- CREATE TABLE `cash_record` (
--    `id` int NOT NULL AUTO_INCREMENT,
--    `balance` decimal(15,2) NOT NULL,
--    `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--    PRIMARY KEY (`id`)
--  ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
--  CREATE TABLE `portfolio` (
--    `id` int NOT NULL AUTO_INCREMENT,
--    `amount` decimal(15,2) DEFAULT NULL,
--    `asset` varchar(45) DEFAULT NULL,
--    `name` varchar(45) DEFAULT NULL,
--    `create_date` date NULL DEFAULT (curdate()),
--    PRIMARY KEY (`id`)
--  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--  
-- --  INSERT INTO cash_record (balance) values (10000);

-- insert into portfolio (amount, asset, name, create_date) values 
-- (100, 'stock', 'tencent', '2023-01-01'),
-- (200, 'stock', 'tencent', '2023-02-01'),
-- (300, 'stock', 'tencent', '2023-03-01'),
-- (100, 'stock', 'tencent', '2023-04-01'),
-- (500, 'stock', 'tencent', '2023-05-01'),
-- (700, 'stock', 'tencent', '2023-06-01'),
-- (300, 'stock', 'tencent', '2023-07-01'),
-- (200, 'stock', 'tencent', '2023-08-01'),
-- (900, 'stock', 'tencent', '2023-09-01'),
-- (100, 'stock', 'tencent', '2023-10-01'),
-- (300, 'stock', 'tencent', '2023-11-01'),
-- (600, 'stock', 'tencent', '2023-12-01');

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

