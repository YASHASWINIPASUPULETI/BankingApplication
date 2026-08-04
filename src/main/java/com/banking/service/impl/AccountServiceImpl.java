package com.banking.service.impl;

import com.banking.dto.AccountRequest;
import com.banking.dto.AccountResponse;
import com.banking.entity.Account;
import com.banking.entity.Customer;
import com.banking.exception.AccountNotFoundException;
import com.banking.exception.CustomerNotFoundException;
import com.banking.repository.AccountRepository;
import com.banking.repository.CustomerRepository;
import com.banking.service.AccountService;
import com.banking.util.AccountUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public AccountServiceImpl(AccountRepository accountRepository, CustomerRepository customerRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public AccountResponse createAccount(AccountRequest accountRequest) {
        Customer customer = customerRepository.findById(accountRequest.getCustomerId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + accountRequest.getCustomerId()));

        String accountNumber;
        do {
            accountNumber = AccountUtil.generateAccountNumber();
        } while (accountRepository.existsByAccountNumber(accountNumber));

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(accountRequest.getAccountType())
                .balance(accountRequest.getBalance())
                .accountStatus("ACTIVE")
                .customer(customer)
                .build();

        Account savedAccount = accountRepository.save(account);
        return mapToResponse(savedAccount);
    }

    @Override
    public AccountResponse getAccountById(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));
        return mapToResponse(account);
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse updateAccount(Long accountId, AccountRequest accountRequest) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));

        Customer customer = customerRepository.findById(accountRequest.getCustomerId())
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + accountRequest.getCustomerId()));

        account.setAccountType(accountRequest.getAccountType());
        account.setCustomer(customer);

        Account updatedAccount = accountRepository.save(account);
        return mapToResponse(updatedAccount);
    }

    @Override
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));
        accountRepository.delete(account);
    }

    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .accountId(account.getAccountId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .accountStatus(account.getAccountStatus())
                .customerId(account.getCustomer().getCustomerId())
                .customerName(account.getCustomer().getFullName())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
