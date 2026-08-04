package com.banking.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @Column(nullable = false)
    private String transactionType;

    @Column(nullable = false)
    private BigDecimal amount;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime transactionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_account_id")
    private Account senderAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_account_id")
    private Account receiverAccount;

    private String remarks;

    public Transaction() {}

    public Transaction(Long transactionId, String transactionType, BigDecimal amount,
                       LocalDateTime transactionDate, Account senderAccount,
                       Account receiverAccount, String remarks) {
        this.transactionId = transactionId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.senderAccount = senderAccount;
        this.receiverAccount = receiverAccount;
        this.remarks = remarks;
    }

    // Getters
    public Long getTransactionId() { return transactionId; }
    public String getTransactionType() { return transactionType; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public Account getSenderAccount() { return senderAccount; }
    public Account getReceiverAccount() { return receiverAccount; }
    public String getRemarks() { return remarks; }

    // Setters
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    public void setSenderAccount(Account senderAccount) { this.senderAccount = senderAccount; }
    public void setReceiverAccount(Account receiverAccount) { this.receiverAccount = receiverAccount; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long transactionId;
        private String transactionType;
        private BigDecimal amount;
        private LocalDateTime transactionDate;
        private Account senderAccount;
        private Account receiverAccount;
        private String remarks;

        public Builder transactionId(Long transactionId) { this.transactionId = transactionId; return this; }
        public Builder transactionType(String transactionType) { this.transactionType = transactionType; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder transactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; return this; }
        public Builder senderAccount(Account senderAccount) { this.senderAccount = senderAccount; return this; }
        public Builder receiverAccount(Account receiverAccount) { this.receiverAccount = receiverAccount; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }

        public Transaction build() {
            return new Transaction(transactionId, transactionType, amount, transactionDate,
                    senderAccount, receiverAccount, remarks);
        }
    }
}
