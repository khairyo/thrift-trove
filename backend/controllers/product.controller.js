require('dotenv').config()
const postgre = require('../config/database')
const cloudinary = require('../config/cloudinary');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            var sql = 'SELECT * FROM products ORDER BY id ASC'

            const { rows } = await postgre.query(sql)

            res.status(200).json({ data: rows })

        } catch (error) {
            res.status(404).json({ msg: error.msg })
        }
    },
    getProductById: async (req, res) => {
        try {
            // OBSOLETE
            // var { id } = req.query; // This expects ?id=1 in the URL

            const { id } = req.params; // This expects /product/1 in the URL
            const sql = 'SELECT * FROM products WHERE id = $1';
    
            const { rows } = await postgre.query(sql, [id]);
    
            if (rows.length > 0) {
                return res.status(200).json(rows[0]); // Return the single product object
            } else {
                return res.status(404).json({ msg: "Product not found" });
            }
        } catch (error) {
            res.status(500).json({ msg: "Error retrieving product", error: error.message });
        }
    },
    getProductByAccId: async (req, res) => {
        try {
            let { accid } = req.params;
    
            const sql = 'SELECT * FROM products WHERE uploader_id = $1';
            
            const { rows } = await postgre.query(sql, [accid]);
    
            if (rows.length === 0) {
                return res.status(404).json({ msg: "No products found" });
            } else {
                return res.status(200).json({ data: rows });
            }
        } catch (error) {
            res.status(500).json({ msg: "Error retrieving product", error: error.message });
        }
    },
    create: async (req, res) => { // implemented
        try {
            console.log('Received request:', req.body);

            const { category, type, product_url, image, name, price, description, uploader_id } = req.body
            const sql = `INSERT INTO products(id, category, type, product_url, image, name, price, description, uploader_id)
                         VALUES(nextval('product_id_seq'), $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`

            const { rows } = await postgre.query(sql, [category, type, product_url, image, name, price, description, uploader_id])

            if (rows[0]) {
                return res.status(201).json({ msg: "Product is created", data: rows[0] })
            }

            return res.status(404).json({ msg: "Failed to create a product" })

        } catch (error) {
            res.status(404).json({ msg: error.message })
        }
    },
    deleteProductById: async (req, res) => { // implemented
        try {
            const { id } = req.body;
            const sql = 'DELETE FROM product where id = $1 RETURNING *'

            const { rows } = await postgre.query(sql, [id])

            if (rows[0]) {
                return res.status(200).json({ msg: "Product is deleted" })
            }

            return res.status(404).json({ msg: "Product is not found" })

        } catch (error) {
            res.status(404).json({ msg: error.msg })
        }
    }
}

module.exports = productController;