const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Endpoint users: GET/POST /api/users dan GET/PATCH/DELETE /api/users/:id.
router.get("/", userController.list);
router.get("/:id", userController.detail);
router.post("/", userController.create);
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);

module.exports = router;
