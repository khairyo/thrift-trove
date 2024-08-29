const cartController = require('../../controllers/cart.controller');
const postgre = require('../../config/database');

// Mock the postgre query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

describe('cartController', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Clears mock history between tests
    });

    describe('getAllCartItems', () => {
        it('should return all cart items if they exist', async () => {
            const req = { query: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ cartitemid: 1, accid: 1, productid: 2, quantity: 1, added_at: new Date() }] });

            await cartController.getAllCartItems(req, res);

            expect(postgre.query).toHaveBeenCalledWith(
                `SELECT cartitemid, accid, productid, quantity, added_at FROM cart WHERE accid = $1 ORDER BY added_at DESC;`,
                [1]
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: [{ cartitemid: 1, accid: 1, productid: 2, quantity: 1, added_at: expect.any(Date) }] });
        });

        it('should return 404 if no cart items exist', async () => {
            const req = { query: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [] });

            await cartController.getAllCartItems(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "No item exists" });
        });

        it('should return 500 if there is a server error', async () => {
            const req = { query: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await cartController.getAllCartItems(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Server error at getAllCartItems: Database error' });
        });
    });

    describe('addToCart', () => {
        it('should return 409 if the item is already in the cart', async () => {
            const req = { body: { accid: 1, productid: 2 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValueOnce({ rows: [{ cartitemid: 1 }] });

            await cartController.addToCart(req, res);

            expect(postgre.query).toHaveBeenCalledWith(
                `SELECT * FROM cart WHERE accid = $1 AND productid = $2`,
                [1, 2]
            );
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ msg: "Item is already in cart" });
        });

        it('should add the item to the cart if it does not exist', async () => {
            const req = { body: { accid: 1, productid: 2 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query
                .mockResolvedValueOnce({ rows: [] }) // No item found
                .mockResolvedValueOnce({ rows: [{ cartitemid: 1, accid: 1, productid: 2 }] }); // Insert successful

            await cartController.addToCart(req, res);

            expect(postgre.query).toHaveBeenCalledWith(
                `INSERT INTO cart(cartitemid, accid, productid) VALUES(nextval('cart_id_seq'), $1, $2) RETURNING *`,
                [1, 2]
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: [{ cartitemid: 1, accid: 1, productid: 2 }] });
        });

        it('should return 404 if adding the item to the cart fails', async () => {
            const req = { body: { accid: 1, productid: 2 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query
                .mockResolvedValueOnce({ rows: [] }) // No item found
                .mockResolvedValueOnce({ rows: [] }); // Insert failed

            await cartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Failed to add an item to cart" });
        });

        it('should return 404 if there is a server error', async () => {
            const req = { body: { accid: 1, productid: 2 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await cartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Database error' });
        });
    });

    describe('deleteItem', () => {
        it('should delete the item if it exists', async () => {
            const req = { body: { cartitemid: 1, accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ cartitemid: 1 }] });

            await cartController.deleteItem(req, res);

            expect(postgre.query).toHaveBeenCalledWith(
                `DELETE FROM cart WHERE cartitemid = $1 AND accid = $2 RETURNING *;`,
                [1, 1]
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ msg: "Item is deleted" });
        });

        it('should return 404 if the item does not exist', async () => {
            const req = { body: { cartitemid: 1, accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [] });

            await cartController.deleteItem(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Item is not found" });
        });

        it('should return 404 if there is a server error', async () => {
            const req = { body: { cartitemid: 1, accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await cartController.deleteItem(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Database error' });
        });
    });
});