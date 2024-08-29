const productController = require('../../controllers/product.controller');
const postgre = require('../../config/database');

// Mock the postgre query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

describe('productController', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Clears mock history between tests
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }] });

            await productController.getAllProducts(req, res);

            expect(postgre.query).toHaveBeenCalledWith('SELECT * FROM products ORDER BY id ASC');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }] });
        });

        it('should return 404 if there is a server error', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await productController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Database error' });
        });
    });

    describe('getAllOtherProducts', () => {
        it('should return all products except those uploaded by the given accid', async () => {
            const req = { params: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ id: 2, uploader_id: 2 }] });

            await productController.getAllOtherProducts(req, res);

            expect(postgre.query).toHaveBeenCalledWith('SELECT * FROM products WHERE uploader_id != $1 ORDER BY id ASC', [1]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: [{ id: 2, uploader_id: 2 }] });
        });

        it('should return 404 if there is a server error', async () => {
            const req = { params: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await productController.getAllOtherProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Database error' });
        });
    });

    describe('getProductById', () => {
        it('should return the product if found by ID', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ id: 1, name: 'Product 1' }] });

            await productController.getProductById(req, res);

            expect(postgre.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = $1', [1]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Product 1' });
        });

        it('should return 404 if the product is not found', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [] });

            await productController.getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Product not found' });
        });

        it('should return 500 if there is a server error', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await productController.getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Error retrieving product', error: 'Database error' });
        });
    });

    describe('getProductByAccId', () => {
        it('should return all products for the given uploader_id', async () => {
            const req = { params: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ id: 1, uploader_id: 1 }] });

            await productController.getProductByAccId(req, res);

            expect(postgre.query).toHaveBeenCalledWith('SELECT * FROM products WHERE uploader_id = $1', [1]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1, uploader_id: 1 }] });
        });

        it('should return 404 if no products are found', async () => {
            const req = { params: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [] });

            await productController.getProductByAccId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'No products found' });
        });

        it('should return 500 if there is a server error', async () => {
            const req = { params: { accid: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await productController.getProductByAccId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Error retrieving product', error: 'Database error' });
        });
    });

    describe('create', () => {
        it('should create a new product', async () => {
            const req = {
                body: {
                    category: 'Category 1',
                    type: 'Type 1',
                    product_url: 'http://example.com',
                    image: 'image.png',
                    name: 'Product 1',
                    price: 100,
                    description: 'A great product',
                    uploader_id: 1
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ id: 1, name: 'Product 1' }] });

            await productController.create(req, res);

            expect(postgre.query).toHaveBeenCalledWith(
                `INSERT INTO products(id, category, type, product_url, image, name, price, description, uploader_id) VALUES(nextval('product_id_seq'), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                ['Category 1', 'Type 1', 'http://example.com', 'image.png', 'Product 1', 100, 'A great product', 1]
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ msg: "Product is created", data: { id: 1, name: 'Product 1' } });
        });

        it('should return 404 if product creation fails', async () => {
            const req = {
                body: {
                    category: 'Category 1',
                    type: 'Type 1',
                    product_url: 'http://example.com',
                    image: 'image.png',
                    name: 'Product 1',
                    price: 100,
                    description: 'A great product',
                    uploader_id: 1
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [] });

            await productController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Failed to create a product" });
        });

        it('should return 404 if there is a server error', async () => {
            const req = {
                body: {
                    category: 'Category 1',
                    type: 'Type 1',
                    product_url: 'http://example.com',
                    image: 'image.png',
                    name: 'Product 1',
                    price: 100,
                    description: 'A great product',
                    uploader_id: 1
                }
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await productController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Database error' });
        });
    });

    describe('deleteProductById', () => {
        it('should delete the product if it exists', async () => {
            const req = { body: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [{ id: 1 }] });

            await productController.deleteProductById(req, res);

            expect(postgre.query).toHaveBeenCalledWith('DELETE FROM product where id = $1 RETURNING *', [1]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Product is deleted" });
        });

        it('should return 404 if the product is not found', async () => {
            const req = { body: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockResolvedValue({ rows: [] });

            await productController.deleteProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Product is not found" });
        });

        it('should return 404 if there is a server error', async () => {
            const req = { body: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            postgre.query.mockRejectedValue(new Error('Database error'));

            await productController.deleteProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Database error' });
        });
    });
});
