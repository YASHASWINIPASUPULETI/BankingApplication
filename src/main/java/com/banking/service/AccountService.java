package com.banking.service;

import com.banking.dto.AccountRequest;
import com.banking.dto.AccountResponse;

import java.util.List;

public interface AccountService {
    AccountResponse createAccount(AccountRequest accountRequest);
    AccountResponse getAccountById(Long accountId);
    List<AccountResponse> getAllAccounts();
    AccountResponse updateAccount(Long accountId, AccountRequest accountRequest);
    void deleteAccount(Long accountId);
}
