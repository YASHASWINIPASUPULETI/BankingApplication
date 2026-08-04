package com.banking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class AccountRequest {

    @NotNull(message = "Customer ID is mandatory")
    private Long customerId;

    @NotBlank(message = "Account Type is mandatory")
    private String accountType;

    @NotNull(message = "Initial balance is mandatory")
    @PositiveOrZero(message = "Initial balance must be zero or positive")
    private BigDecimal balance;

    public AccountRequest() {}

    public AccountRequest(Long customerId, String accountType, BigDecimal balance) {
        this.customerId = customerId;
        this.accountType = accountType;
        this.balance = balance;
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
