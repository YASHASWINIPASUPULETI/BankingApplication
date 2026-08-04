package com.banking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class DepositRequest {

    @NotBlank(message = "Account number is mandatory")
    private String accountNumber;

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String remarks;

    public DepositRequest() {}

    public DepositRequest(String accountNumber, BigDecimal amount, String remarks) {
        this.accountNumber = accountNumber;
        this.amount = amount;
        this.remarks = remarks;
    }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
