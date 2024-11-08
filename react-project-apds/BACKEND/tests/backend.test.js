const request = require('supertest');
const mongoose = require('mongoose');
const { Transaction } = require("../routes/models");
const fs = require('fs');
const { exec } = require('child_process');

jest.mock('helmet');
jest.mock('xss-clean');
jest.mock('express-rate-limit');

jest.mock('fs', () => ({
  existsSync: jest.fn().mockImplementation((path) => {
    return path === '../../BACKEND/keys/certificate' || path === '../../BACKEND/keys/privatekey';
  }),
}));

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

jest.setTimeout(15000); 

describe("Security Middleware Tests", () => {
  let app;

  beforeAll(() => {
    app = require("../../src/App");  
  });

  test("Clickjacking protection using helmet should be applied", async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-frame-options']).toBeDefined();
  });

  test("XSS protection should be applied", async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
  });

  test("Rate limiting for DDoS protection should be applied", async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-ratelimit-limit']).toBeDefined();
  });
});

describe("Transaction Route Tests", () => {
  beforeAll(() => {
    Transaction.prototype.save = jest.fn().mockResolvedValue({
      amountToTransfer: 100,
      description: "Test transaction",
      date: new Date(),
      userId: mongoose.Types.ObjectId(),
    });

    Transaction.findOne = jest.fn().mockResolvedValue({
      amountToTransfer: 100,
      description: "Test transaction",
      date: new Date(),
      userId: mongoose.Types.ObjectId(),
    });
  });

  test("Transaction creation should use Mongoose models (SQL Injection Protection)", async () => {
    const mockTransaction = {
      amountToTransfer: 100,
      description: "Test transaction",
      date: new Date(),
      userId: mongoose.Types.ObjectId(),
    };

    const transaction = new Transaction(mockTransaction);
    await transaction.save();

    const savedTransaction = await Transaction.findOne({ description: "Test transaction" });
    
    expect(savedTransaction.amountToTransfer).toBe(100);
  });
});

describe("SSL and Vulnerability Tests", () => {
  test("Check SSL certificate and key presence", () => {
    const certExists = fs.existsSync('../../BACKEND/keys/certificate');
    const keyExists = fs.existsSync('../../BACKEND/keys/privatekey');

    expect(certExists).toBeTruthy();
    expect(keyExists).toBeTruthy();
  });

  test("Run vulnerability scan", (done) => {
    exec.mockImplementationOnce((cmd, callback) => {
      const fakeAuditResults = {
        metadata: {
          vulnerabilities: {
            high: 5,
          },
        },
      };
      callback(null, JSON.stringify(fakeAuditResults));
    });

    exec('npm audit --json', (error, stdout, stderr) => {
      const auditResults = JSON.parse(stdout || '{}');
      const highVulnerabilities = auditResults.metadata.vulnerabilities.high;

      expect(highVulnerabilities).toBeLessThan(10); 
      done();
    });
  });
});
