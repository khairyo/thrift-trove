const express = require("express");
const router = express.Router();

const accountController = require("../controllers/account.controller")
const verifyToken = require("../middleware/auth");

// router.get("/get-all-accounts", accountController.getAllAccounts);
router.get("/", verifyToken, accountController.getById);
router.post("/create", accountController.create);
router.post("/login", accountController.verifyAccount);
// router.put("/update-email", accountController.updateEmail);
// router.put("/update-password", accountController.updatePassword);
// router.delete("/", accountController.deleteById);

module.exports = router;