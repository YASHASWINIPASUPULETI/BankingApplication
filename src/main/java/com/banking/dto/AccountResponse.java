package com.banking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountResponse {
    private Long accountId;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String accountStatus;
    private Long customerId;
    private String customerName;
    private LocalDateTime createdAt;

    public AccountResponse() {}

    public AccountResponse(Long accountId, String accountNumber, String accountType, BigDecimal balance,
                           String accountStatus, Long customerId, String customerName, LocalDateTime createdAt) {
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.accountStatus = accountStatus;
        this.customerId = customerId;
        this.customerName = customerName;
        this.createdAt = createdAt;
    }

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long accountId;
        private String accountNumber;
        private String accountType;
        private BigDecimal balance;
        private String accountStatus;
        private Long customerId;
        private String customerName;
        private LocalDateTime createdAt;

        public Builder accountId(Long accountId) { this.accountId = accountId; return this; }
        public Builder accountNumber(String accountNumber) { this.accountNumber = accountNumber; return this; }
        public Builder accountType(String accountType) { this.accountType = accountType; return this; }
        public Builder balance(BigDecimal balance) { this.balance = balance; return this; }
        public Builder accountStatus(String accountStatus) { this.accountStatus = accountStatus; return this; }
        public Builder customerId(Long customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AccountResponse build() {
            return new AccountResponse(accountId, accountNumber, accountType, balance,
                    accountStatus, customerId, customerName, createdAt);
        }
    }
}
