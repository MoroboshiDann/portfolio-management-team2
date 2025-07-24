-- Create the database
CREATE DATABASE IF NOT EXISTS portfolio_pulse;
USE portfolio_pulse;

-- Create portfolio_values table
CREATE TABLE IF NOT EXISTS portfolio_values (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT NOT NULL,
  date DATE NOT NULL,
  value DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (portfolio_id),
  INDEX (date)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  portfolio_id INT NOT NULL,
  transaction_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type ENUM('buy', 'sell', 'dividend', 'deposit', 'withdrawal') NOT NULL,
  asset_id INT,
  quantity DECIMAL(15, 6),
  price_per_unit DECIMAL(15, 2),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (portfolio_id),
  INDEX (transaction_date),
  INDEX (asset_id)
);

-- Sample data for portfolio_values
INSERT INTO portfolio_values (portfolio_id, date, value) VALUES
(1, '2023-01-01', 5000.00),
(1, '2023-02-01', 5200.00),
(1, '2023-03-01', 5500.00),
(1, '2023-04-01', 5800.00),
(1, '2023-05-01', 6000.00),
(1, '2023-06-01', 6200.00),
(1, '2023-07-01', 6500.00),
(1, '2023-08-01', 6800.00),
(1, '2023-09-01', 7000.00),
(1, '2023-10-01', 7200.00),
(1, '2023-11-01', 7500.00),
(1, '2023-12-01', 7800.00);

-- Sample data for transactions
INSERT INTO transactions (portfolio_id, transaction_date, amount, type, description) VALUES
(1, '2023-01-15', 1000.00, 'buy', 'Initial investment'),
(1, '2023-02-10', 500.00, 'buy', 'Additional investment'),
(1, '2023-03-05', 200.00, 'dividend', 'Quarterly dividend'),
(1, '2023-04-20', 800.00, 'buy', 'Stock purchase'),
(1, '2023-05-15', -300.00, 'sell', 'Partial profit taking'),
(1, '2023-06-10', 200.00, 'dividend', 'Quarterly dividend'),
(1, '2023-07-05', 1200.00, 'buy', 'New stock purchase'),
(1, '2023-08-20', -500.00, 'sell', 'Rebalancing portfolio'),
(1, '2023-09-15', 200.00, 'dividend', 'Quarterly dividend'),
(1, '2023-10-10', 900.00, 'buy', 'Market dip purchase'),
(1, '2023-11-05', -400.00, 'withdrawal', 'Personal expense'),
(1, '2023-12-20', 200.00, 'dividend', 'Quarterly dividend');