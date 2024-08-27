const express = require("express")
const router = express.Router()

const productController = require("../controllers/product.controller")

router.get("/get-all-products", productController.getAllProducts)
router.get("/get-all-other-products/:accid", productController.getAllOtherProducts)
router.get("/:id", productController.getProductById);
router.get("/get-all-products-by-acc/:accid", productController.getProductByAccId)
router.post("/create", productController.create)
router.delete("/delete", productController.deleteProductById)

module.exports = router;