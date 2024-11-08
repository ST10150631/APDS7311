const app = require("../app");  
const mongoose = require("mongoose");
const { User, Account, Transaction } = require("../routes/models");  

beforeAll(async () => {
    // Set up MongoDB memory server or connect to test database before tests
    await mongoose.connect('mongodb://localhost/test-db', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Close MongoDB connection after tests are complete
    await mongoose.connection.close();
});

describe("User Registration and Login API", () => {
    it("should register a new user", async () => {
        const newUser = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            username: "johndoe",
            password: "password123",
            idNumber: "1234567890123"
        };

        const response = await request(app)
            .post("/register")
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty("firstName", "John");
        expect(response.body.account).toHaveProperty("accountNumber");
    });

    it("should return 400 if invalid user data is provided", async () => {
        const invalidUser = {
            firstName: "John",
            lastName: "Doe",
            email: "invalid-email",  
            username: "johndoe",
            password: "password123",
            idNumber: "1234567890123"
        };

        const response = await request(app)
            .post("/register")
            .send(invalidUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid email format.");
    });

    it("should log in an existing user", async () => {
         const existingUser = {
            username: "johndoe",
            password: "password123"
        };

        const response = await request(app)
            .post("/login")
            .send(existingUser);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user).toHaveProperty("username", "johndoe");
    });

    it("should return 401 if login fails", async () => {
        const invalidLogin = {
            username: "johndoe",
            password: "wrongpassword"
        };

        const response = await request(app)
            .post("/login")
            .send(invalidLogin);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid username or password");
    });
});

describe("Transaction API", () => {
    let token;

    beforeAll(async () => {
         const response = await request(app)
            .post("/register")
            .send({
                firstName: "Jane",
                lastName: "Doe",
                email: "jane@example.com",
                username: "janedoe",
                password: "password123",
                idNumber: "9876543210123"
            });

        const loginResponse = await request(app)
            .post("/login")
            .send({
                username: "janedoe",
                password: "password123"
            });

        token = loginResponse.body.token;
    });

    it("should allow a user to make a payment", async () => {
        const paymentDetails = {
            recipientName: "John Smith",
            recipientsBank: "Bank of Example",
            recipientsAccountNumber: "123456789",
            amountToTransfer: 100,
            swiftCode: "EXAMPLESWIFT",
            transactionType: "international",
            status: "completed"
        };

        const response = await request(app)
            .post("/internationalpayment")
            .set("Authorization", `Bearer ${token}`)
            .send(paymentDetails);

        expect(response.status).toBe(201);
        expect(response.body.senderNewBalance).toBeDefined();
        expect(response.body.transactionId).toBeDefined();
    });

    it("should return 400 if balance is insufficient", async () => {
        const paymentDetails = {
            recipientName: "John Smith",
            recipientsBank: "Bank of Example",
            recipientsAccountNumber: "123456789",
            amountToTransfer: 10000,  
            swiftCode: "EXAMPLESWIFT",
            transactionType: "international",
            status: "failed"
        };

        const response = await request(app)
            .post("/internationalpayment")
            .set("Authorization", `Bearer ${token}`)
            .send(paymentDetails);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Insufficient balance");
    });
});
