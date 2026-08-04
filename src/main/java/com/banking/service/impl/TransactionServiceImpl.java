package com.banking.service.impl;

import com.banking.dto.DepositRequest;
import com.banking.dto.TransactionResponse;
import com.banking.dto.TransferRequest;
import com.banking.dto.WithdrawRequest;
import com.banking.entity.Account;
import com.banking.entity.Transaction;
import com.banking.exception.AccountNotFoundException;
import com.banking.exception.InsufficientBalanceException;
import com.banking.exception.InvalidTransactionException;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import com.banking.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public TransactionResponse deposit(DepositRequest depositRequest) {
        Account account = accountRepository.findByAccountNumber(depositRequest.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + depositRequest.getAccountNumber()));

        account.setBalance(account.getBalance().add(depositRequest.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionType("DEPOSIT")
                .amount(depositRequest.getAmount())
                .receiverAccount(account)
                .remarks(depositRequest.getRemarks() != null ? depositRequest.getRemarks() : "Cash Deposit")
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(WithdrawRequest withdrawRequest) {
        Account account = accountRepository.findByAccountNumber(withdrawRequest.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + withdrawRequest.getAccountNumber()));

        if (account.getBalance().compareTo(withdrawRequest.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(withdrawRequest.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionType("WITHDRAW")
                .amount(withdrawRequest.getAmount())
                .senderAccount(account)
                .remarks(withdrawRequest.getRemarks() != null ? withdrawRequest.getRemarks() : "Cash Withdrawal")
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponse transfer(TransferRequest transferRequest) {
        if (transferRequest.getSenderAccountNumber().equals(transferRequest.getReceiverAccountNumber())) {
            throw new InvalidTransactionException("Sender and receiver accounts cannot be the same");
        }

        Account senderAccount = accountRepository.findByAccountNumber(transferRequest.getSenderAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Sender account not found: " + transferRequest.getSenderAccountNumber()));

        Account receiverAccount = accountRepository.findByAccountNumber(transferRequest.getReceiverAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Receiver account not found: " + transferRequest.getReceiverAccountNumber()));

        if (senderAccount.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance for transfer");
        }

        senderAccount.setBalance(senderAccount.getBalance().subtract(transferRequest.getAmount()));
        receiverAccount.setBalance(receiverAccount.getBalance().add(transferRequest.getAmount()));

        accountRepository.save(senderAccount);
        accountRepository.save(receiverAccount);

        Transaction transaction = Transaction.builder()
                .transactionType("TRANSFER")
                .amount(transferRequest.getAmount())
                .senderAccount(senderAccount)
                .receiverAccount(receiverAccount)
                .remarks(transferRequest.getRemarks() != null ? transferRequest.getRemarks() : "Fund Transfer")
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionResponse getTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new InvalidTransactionException("Transaction not found with ID: " + transactionId));
        return mapToResponse(transaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionId(transaction.getTransactionId())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .transactionDate(transaction.getTransactionDate() != null ? transaction.getTransactionDate() : LocalDateTime.now())
                .senderAccountNumber(transaction.getSenderAccount() != null ? transaction.getSenderAccount().getAccountNumber() : null)
                .receiverAccountNumber(transaction.getReceiverAccount() != null ? transaction.getReceiverAccount().getAccountNumber() : null)
                .remarks(transaction.getRemarks())
                .build();
    }
}
