require('dotenv').config()
const postgre = require('../config/database')

const cartController = {
    getAllCartItems: async (req, res) => {
        try {
            const { accid } = req.query;
            const sql = `SELECT cartitemid, accid, productid, quantity, added_at FROM cart
                        WHERE accid = $1 ORDER BY added_at DESC;`

            const { rows } = await postgre.query(sql, [accid])

            if (rows[0]) {
                return res.status(200).json({ data: rows })
            }

            res.status(404).json({ msg: "No item exists" })

        } catch (error) {
            res.status(500).json({ msg: `Server error at getAllCartItems: ${error.message}` })
        }
    },
    addToCart: async (req, res) => {
        try {

            const { accid, productid } = req.body;

            // Check if the item already exists in the cart
            const checkItemSql = `SELECT * FROM cart WHERE accid = $1 AND productid = $2`;
            const checkItemResult = await postgre.query(checkItemSql, [accid, productid]);

            if (checkItemResult.rows.length > 0) {
                return res.status(409).json({ msg: "Item is already in cart" });
            } 
            
            // If the item is not in the cart, add it
            const sql = `INSERT INTO cart(cartitemid, accid, productid) VALUES(nextval('cart_id_seq'), $1, $2) RETURNING *`;
            const { rows } = await postgre.query(sql, [accid, productid])

            if (rows[0]) {
                return res.status(200).json({ data: rows })
            }

            return res.status(404).json({ msg: "Failed to add an item to cart" })
        } catch (error) {
            res.status(404).json({ msg: error.msg })
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { cartitemid, accid } = req.body;
            const sql = `DELETE FROM cart WHERE cartitemid = $1 AND accid = $2 RETURNING *;`

            const { rows } = await postgre.query(sql, [cartitemid, accid])

            if (rows[0]) {
                return res.status(201).json({ msg: "Item is deleted" })
            }

            return res.status(404).json({ msg: "Item is not found" })

        } catch (error) {
            res.status(404).json({ msg: error.msg })
        }
    }
}

module.exports = cartController;