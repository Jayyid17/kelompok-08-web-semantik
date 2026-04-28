const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Endpoint tasks: GET/POST /api/tasks dan GET/PATCH/DELETE /api/tasks/:id.
router.get("/", taskController.list);
router.get("/:id", taskController.detail);
router.post("/", taskController.create);
router.patch("/:id", taskController.update);
router.delete("/:id", taskController.remove);
module.exports = router;
