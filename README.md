# Banking Application System

## Project Overview
The Banking Application System is a robust, production-ready RESTful web service built using Java 17 and Spring Boot. It provides a complete set of APIs for managing customers, accounts, and financial transactions such as deposits, withdrawals, and inter-account transfers. The application follows SOLID principles, clean architecture, and industry best practices.

## Features
- **Customer Management**: Create, Read, Update, and Delete customer profiles.
- **Account Management**: Create and manage bank accounts (Savings/Current) for customers. Auto-generates unique 12-digit account numbers.
- **Transaction Processing**: Securely perform Deposit, Withdraw, and Transfer operations with proper validation and transactional integrity.
- **Exception Handling**: Global exception handling with meaningful error responses.
- **Validation**: Strict input validation using Spring Boot Bean Validation.
- **API Documentation**: Interactive API documentation via Swagger/OpenAPI.

## Technology Stack
- **Java 17**
- **Spring Boot 3.2.x**
- **Spring Data JPA**
- **MySQL** (Database)
- **Maven** (Build Tool)
- **Lombok** (Boilerplate reduction)
- **Hibernate** (ORM)

## Project Structure
```text
com.banking
│
├── controller      # REST Controllers for handling HTTP requests
├── service         # Interfaces for Business Logic
├── service.impl    # Implementations of Business Logic
├── repository      # Spring Data JPA Data Access Interfaces
├── entity          # JPA Entities mapping to Database Tables
├── dto             # Data Transfer Objects for Request/Response
├── exception       # Custom Exceptions and Global Exception Handler
├── config          # Application Configurations (Swagger)
├── util            # Helper Utilities
└── BankingApplication.java # Main Application Class
```

## Database Setup

1. Make sure you have MySQL installed and running on `localhost:3306`.
2. Create the database:
   ```sql
   CREATE DATABASE bankdb;
   ```
3. Update database credentials in `src/main/resources/application.properties` if your MySQL username/password is not `root/root`.
4. The application uses `spring.jpa.hibernate.ddl-auto=update` so all tables (`customers`, `accounts`, `transactions`) will be generated automatically on startup.

## How to Run

1. Open a terminal in the root directory (where `pom.xml` is located).
2. Clean and package the application:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. The application will start on port `8080`.

## API Endpoints

### Swagger UI
- **URL**: `http://localhost:8080/swagger-ui.html`

### Customers
- `POST /api/customers` : Create a new customer
- `GET /api/customers` : Get all customers
- `GET /api/customers/{id}` : Get customer by ID
- `PUT /api/customers/{id}` : Update customer details
- `DELETE /api/customers/{id}` : Delete customer

### Accounts
- `POST /api/accounts` : Create a new account
- `GET /api/accounts` : Get all accounts
- `GET /api/accounts/{id}` : Get account by ID
- `PUT /api/accounts/{id}` : Update account details
- `DELETE /api/accounts/{id}` : Delete account

### Transactions
- `POST /api/transactions/deposit` : Deposit amount into an account
- `POST /api/transactions/withdraw` : Withdraw amount from an account
- `POST /api/transactions/transfer` : Transfer amount between accounts
- `GET /api/transactions` : Get all transactions
- `GET /api/transactions/{id}` : Get transaction by ID

## Future Enhancements
- Spring Security with JWT Authentication.
- Pagination and Sorting for GET endpoints.
- Integration with external notification services (Email/SMS).
- Dockerization of the application.
