class ValidationUtils {
    // Whitelist: Allow only letters for first/last names, 1-50 characters
    static validateName(name) {
        const nameRegex = /^[a-zA-Z\s]{1,50}$/;
        if (!nameRegex.test(name)) {
            return false;
        }
        return this.validateAgainstBlacklist(name);
    }

    // Whitelist: Allow any character for the username, 3-20 characters
    static validateUsername(username) {
        const usernameRegex = /^.{3,20}$/;
        if (!usernameRegex.test(username)) {
            return false;
        }
        return this.validateAgainstBlacklist(username);
    }

    // Whitelist: Basic email validation
    static validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }


    // Whitelist: South African ID validation 
    static validateIDNumber(idNumber) {
        const idRegex = /^\d{13}$/;
        if (!idRegex.test(idNumber)) {
            return false;
        }
        return this.validateAgainstBlacklist(idNumber);
    }

   // Whitelist: Account number must be alphanumeric, length 5-20
   static validateAccountNumber(accountNumber) {
    const accountNumberRegex = /^[a-zA-Z0-9]{5,20}$/;
    return accountNumberRegex.test(accountNumber);
    }
    
    // Whitelist: Amount must be a positive number
    static validateAmount(amount) {
        return amount > 0;
    }

   // Whitelist: Allow any character for the SWIFT code, length 8 - 11 alphanumeric characters
    static validateSwiftCode(swiftCode) {
        const swiftCodeRegex = /^[A-Za-z0-9]{8,11}$/i;
        return swiftCodeRegex.test(swiftCode);
    }

    // Blacklist: Disallow unwanted characters to prevent SQL injections, scripts and attacks
    static validateAgainstBlacklist(input) {
        const blacklistRegex = /[`<>;"'(){}[\]]/;  
        return !blacklistRegex.test(input);  
    }
}

module.exports = ValidationUtils;
