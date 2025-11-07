const express = require("express");
const router = express.Router();
const controller = require("../controllers/project.controller");
const { verifyToken, permitRoles } = require("../middleware/authMiddleware");

// GET all
router.get("/", verifyToken, permitRoles("PROJECT-INPUTTER", "PROJECT-AUTHORIZER", "VIEWER"), controller.getAll);

// GET by ID
router.get("/:id", verifyToken, permitRoles("PROJECT-INPUTTER", "PROJECT-AUTHORIZER", "VIEWER"), controller.getById);

// POST create
router.post("/", verifyToken, permitRoles("PROJECT-INPUTTER"), controller.create);

// PUT update
router.put("/:id", verifyToken, permitRoles("PROJECT-INPUTTER"), controller.update);

// DELETE
router.delete("/:id", verifyToken, permitRoles("PROJECT-INPUTTER"), controller.remove);

// PUT status update (AUTHORIZER only)
// Changed from PATCH /status/:id to PUT /:id/status for consistency
router.put("/:id/status", verifyToken, permitRoles("PROJECT-AUTHORIZER"), controller.updateStatus);

module.exports = router;