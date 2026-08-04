CREATE DATABASE IF NOT EXISTS bankdb;
USE bankdb;

CREATE TABLE customers (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255),
    date_of_birth DATE,
    created_at DATETIME
);

CREATE TABLE accounts (
    account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    account_type VARCHAR(255) NOT NULL,
    balance DECIMAL(38,2) NOT NULL,
    account_status VARCHAR(255) NOT NULL,
    customer_id BIGINT NOT NULL,
    created_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE transactions (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_type VARCHAR(255) NOT NULL,
    amount DECIMAL(38,2) NOT NULL,
    transaction_date DATETIME NOT NULL,
    remarks VARCHAR(255),
    sender_account_id BIGINT,
    receiver_account_id BIGINT,
    FOREIGN KEY (sender_account_id) REFERENCES accounts(account_id),
    FOREIGN KEY (receiver_account_id) REFERENCES accounts(account_id)
);
