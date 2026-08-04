package com.banking.service;

import com.banking.dto.DepositRequest;
import com.banking.dto.TransactionResponse;
import com.banking.dto.TransferRequest;
import com.banking.dto.WithdrawRequest;

import java.util.List;

public interface TransactionService {
    TransactionResponse deposit(DepositRequest depositRequest);
    TransactionResponse withdraw(WithdrawRequest withdrawRequest);
    TransactionResponse transfer(TransferRequest transferRequest);
    List<TransactionResponse> getAllTransactions();
    TransactionResponse getTransactionById(Long transactionId);
}
