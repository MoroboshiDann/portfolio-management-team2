create schema if not exists portfolio_pulse;
use portfolio_pulse;

-- CREATE TABLE `cash_record` (
--    `id` int NOT NULL AUTO_INCREMENT,
--    `balance` decimal(15,2) NOT NULL,
--    `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--    PRIMARY KEY (`id`)
--  ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
 CREATE TABLE `portfolio` (
   `id` int NOT NULL AUTO_INCREMENT,
   `amount` decimal(15,2) DEFAULT NULL,
   `asset` varchar(45) DEFAULT NULL,
   `name` varchar(45) DEFAULT NULL,
   `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
--  INSERT INTO cash_record (balance) values (10000);
 
 INSERT  INTO portfolio (amount, asset, name) values 
(100, 'stock', 'tencent'),
(200, 'stock', 'amd'),
(150, 'stock', 'baidu'),
(-10, 'stock', 'tencet'),
(1000, 'bond', 'hsbc'),
(2000, 'real estate', 'aaa');