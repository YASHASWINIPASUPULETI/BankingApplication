package com.banking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class TransferRequest {

    @NotBlank(message = "Sender account number is mandatory")
    private String senderAccountNumber;

    @NotBlank(message = "Receiver account number is mandatory")
    private String receiverAccountNumber;

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String remarks;

    public TransferRequest() {}

    public TransferRequest(String senderAccountNumber, String receiverAccountNumber, BigDecimal amount, String remarks) {
        this.senderAccountNumber = senderAccountNumber;
        this.receiverAccountNumber = receiverAccountNumber;
        this.amount = amount;
        this.remarks = remarks;
    }

    public String getSenderAccountNumber() { return senderAccountNumber; }
    public void setSenderAccountNumber(String senderAccountNumber) { this.senderAccountNumber = senderAccountNumber; }
    public String getReceiverAccountNumber() { return receiverAccountNumber; }
    public void setReceiverAccountNumber(String receiverAccountNumber) { this.receiverAccountNumber = receiverAccountNumber; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
