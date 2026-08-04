package com.banking.service;

import com.banking.dto.CustomerRequest;
import com.banking.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {
    CustomerResponse createCustomer(CustomerRequest customerRequest);
    CustomerResponse getCustomerById(Long customerId);
    List<CustomerResponse> getAllCustomers();
    CustomerResponse updateCustomer(Long customerId, CustomerRequest customerRequest);
    void deleteCustomer(Long customerId);
}
