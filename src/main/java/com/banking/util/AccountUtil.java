package com.banking.util;

import java.util.Random;

public class AccountUtil {
    
    private static final Random random = new Random();

    public static String generateAccountNumber() {
        long number = (long) (Math.random() * 1000000000000L);
        return String.format("%012d", number);
    }
}
