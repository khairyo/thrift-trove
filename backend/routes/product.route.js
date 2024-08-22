const express = require("express")
const router = express.Router()

const productController = require("../controllers/product.controller")

router.get("/get-all-products", productController.getAllProducts)
router.get("/:id", productController.getProductById);
// router.get("/get-all-products-by-acc", productController.getProductByAccId)
// router.post("/create", productController.create)
// router.put("/update", productController.updateProductById)
// router.delete("/delete", productController.deleteProductById)

module.exports = router;