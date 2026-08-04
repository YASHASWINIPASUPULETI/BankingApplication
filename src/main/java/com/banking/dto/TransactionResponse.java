package com.banking.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long transactionId;
    private String transactionType;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private String senderAccountNumber;
    private String receiverAccountNumber;
    private String remarks;

    public TransactionResponse() {}

    public TransactionResponse(Long transactionId, String transactionType, BigDecimal amount,
                               LocalDateTime transactionDate, String senderAccountNumber,
                               String receiverAccountNumber, String remarks) {
        this.transactionId = transactionId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.senderAccountNumber = senderAccountNumber;
        this.receiverAccountNumber = receiverAccountNumber;
        this.remarks = remarks;
    }

    public Long getTransactionId() { return transactionId; }
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    public String getSenderAccountNumber() { return senderAccountNumber; }
    public void setSenderAccountNumber(String senderAccountNumber) { this.senderAccountNumber = senderAccountNumber; }
    public String getReceiverAccountNumber() { return receiverAccountNumber; }
    public void setReceiverAccountNumber(String receiverAccountNumber) { this.receiverAccountNumber = receiverAccountNumber; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long transactionId;
        private String transactionType;
        private BigDecimal amount;
        private LocalDateTime transactionDate;
        private String senderAccountNumber;
        private String receiverAccountNumber;
        private String remarks;

        public Builder transactionId(Long transactionId) { this.transactionId = transactionId; return this; }
        public Builder transactionType(String transactionType) { this.transactionType = transactionType; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder transactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; return this; }
        public Builder senderAccountNumber(String senderAccountNumber) { this.senderAccountNumber = senderAccountNumber; return this; }
        public Builder receiverAccountNumber(String receiverAccountNumber) { this.receiverAccountNumber = receiverAccountNumber; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }

        public TransactionResponse build() {
            return new TransactionResponse(transactionId, transactionType, amount, transactionDate,
                    senderAccountNumber, receiverAccountNumber, remarks);
        }
    }
}
