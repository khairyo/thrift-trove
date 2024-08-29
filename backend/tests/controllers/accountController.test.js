const accountController = require('../../controllers/account.controller');
const postgre = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock the postgre query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('accountController', () => {
    describe('getById', () => {
        it('should return account data if account exists', async () => {
            // Mock the response from the database
            const mockData = { rows: [{ accemail: 'test@example.com' }] };
            postgre.query.mockResolvedValue(mockData);

            // Mock the request and response objects
            const req = { user: { accemail: 'test@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await accountController.getById(req, res);

            expect(postgre.query).toHaveBeenCalledWith('SELECT * FROM account WHERE accemail = $1', ['test@example.com']);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: mockData.rows[0] });
        });

        it('should return 404 if account does not exist', async () => {
            // Mock no data returned
            postgre.query.mockResolvedValue({ rows: [] });

            const req = { user: { accemail: 'nonexistent@example.com' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await accountController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Account not found" });
        });
    });

    describe('create', () => {
        it('should create a new account if account does not exist', async () => {
            bcrypt.hash.mockResolvedValue('hashedPassword');
            postgre.query
                .mockResolvedValueOnce({ rows: [{ exists: false }] }) // Mock account does not exist
                .mockResolvedValueOnce({ rows: [{ accid: 1 }] }) // Mock inserting account
                .mockResolvedValueOnce({ rows: [{ profile: 'created' }] }); // Mock inserting user profile

            const req = { body: { username: 'testuser', accemail: 'test@example.com', accpass: 'password' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await accountController.create(req, res);

            expect(postgre.query).toHaveBeenCalledTimes(3); 
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ msg: "Account created" });
        });

        it('should return 409 if account already exists', async () => {
            postgre.query.mockResolvedValueOnce({ rows: [{ exists: true }] });

            const req = { body: { username: 'testuser', accemail: 'test@example.com', accpass: 'password' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await accountController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ msg: "Account already exists" });
        });
    });

    describe('verifyAccount', () => {
        it('should return a token if credentials are correct', async () => {
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');
            postgre.query.mockResolvedValue({ rows: [{ accemail: 'test@example.com', accpass: 'hashedPassword' }] });

            const req = { body: { accemail: 'test@example.com', accpass: 'password' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await accountController.verifyAccount(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith({ accemail: 'test@example.com' }, process.env.JWT_SECRET, { expiresIn: 86400 });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ token: 'token', result: { accemail: 'test@example.com', accpass: 'hashedPassword' } });
        });

        it('should return 401 if password is incorrect', async () => {
            bcrypt.compare.mockResolvedValue(false);
            postgre.query.mockResolvedValue({ rows: [{ accemail: 'test@example.com', accpass: 'hashedPassword' }] });

            const req = { body: { accemail: 'test@example.com', accpass: 'wrongpassword' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await accountController.verifyAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ msg: "Password is incorrect" });
        });

        it('should return 404 if account is not found', async () => {
            postgre.query.mockResolvedValue({ rows: [] });

            const req = { body: { accemail: 'nonexistent@example.com', accpass: 'password' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await accountController.verifyAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Account is not found" });
        });
    });
});
