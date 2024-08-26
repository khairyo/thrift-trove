const express = require("express")
const router = express.Router()

const cartController = require("../controllers/cart.controller")

router.get("/get-all-cartitems", cartController.getAllCartItems)
router.post("/create", cartController.addToCart)
router.delete("/delete", cartController.deleteItem)

module.exports = router;