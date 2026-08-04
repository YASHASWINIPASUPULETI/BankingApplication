package com.banking.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Column(nullable = false)
    private String accountType;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private String accountStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "senderAccount", cascade = CascadeType.ALL)
    private List<Transaction> sentTransactions = new ArrayList<>();

    @OneToMany(mappedBy = "receiverAccount", cascade = CascadeType.ALL)
    private List<Transaction> receivedTransactions = new ArrayList<>();

    public Account() {}

    public Account(Long accountId, String accountNumber, String accountType, BigDecimal balance,
                   String accountStatus, Customer customer, LocalDateTime createdAt,
                   List<Transaction> sentTransactions, List<Transaction> receivedTransactions) {
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.balance = balance;
        this.accountStatus = accountStatus;
        this.customer = customer;
        this.createdAt = createdAt;
        this.sentTransactions = sentTransactions;
        this.receivedTransactions = receivedTransactions;
    }

    // Getters
    public Long getAccountId() { return accountId; }
    public String getAccountNumber() { return accountNumber; }
    public String getAccountType() { return accountType; }
    public BigDecimal getBalance() { return balance; }
    public String getAccountStatus() { return accountStatus; }
    public Customer getCustomer() { return customer; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Transaction> getSentTransactions() { return sentTransactions; }
    public List<Transaction> getReceivedTransactions() { return receivedTransactions; }

    // Setters
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setSentTransactions(List<Transaction> sentTransactions) { this.sentTransactions = sentTransactions; }
    public void setReceivedTransactions(List<Transaction> receivedTransactions) { this.receivedTransactions = receivedTransactions; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long accountId;
        private String accountNumber;
        private String accountType;
        private BigDecimal balance;
        private String accountStatus;
        private Customer customer;
        private LocalDateTime createdAt;
        private List<Transaction> sentTransactions = new ArrayList<>();
        private List<Transaction> receivedTransactions = new ArrayList<>();

        public Builder accountId(Long accountId) { this.accountId = accountId; return this; }
        public Builder accountNumber(String accountNumber) { this.accountNumber = accountNumber; return this; }
        public Builder accountType(String accountType) { this.accountType = accountType; return this; }
        public Builder balance(BigDecimal balance) { this.balance = balance; return this; }
        public Builder accountStatus(String accountStatus) { this.accountStatus = accountStatus; return this; }
        public Builder customer(Customer customer) { this.customer = customer; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder sentTransactions(List<Transaction> sentTransactions) { this.sentTransactions = sentTransactions; return this; }
        public Builder receivedTransactions(List<Transaction> receivedTransactions) { this.receivedTransactions = receivedTransactions; return this; }

        public Account build() {
            return new Account(accountId, accountNumber, accountType, balance, accountStatus,
                    customer, createdAt, sentTransactions, receivedTransactions);
        }
    }
}
