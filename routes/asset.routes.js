const express = require("express");
const router = express.Router();
const controller = require("../controllers/asset.controller");
const { verifyToken, permitRoles } = require("../middleware/authMiddleware"); // Correct import name

// GET all (VIEWER, ASSET-INPUTTER, AUTHORIZER)
router.get("/", verifyToken, permitRoles("VIEWER", "ASSET-INPUTTER", "ASSET-AUTHORIZER"), controller.getAll);

// GET by ID (VIEWER, ASSET-INPUTTER, AUTHORIZER)
router.get("/:id", verifyToken, permitRoles("VIEWER", "ASSET-INPUTTER", "ASSET-AUTHORIZER"), controller.getById);

// POST create (ASSET-INPUTTER)
router.post("/", verifyToken, permitRoles("ASSET-INPUTTER"), controller.create);

// PUT update (ASSET-INPUTTER)
router.put("/:id", verifyToken, permitRoles("ASSET-INPUTTER"), controller.update);

// DELETE (ASSET-INPUTTER)
router.delete("/:id", verifyToken, permitRoles("ASSET-INPUTTER"), controller.remove);

// PATCH status update (AUTHORIZER only)
router.patch("/status/:id", verifyToken, permitRoles("ASSET-AUTHORIZER"), controller.updateStatus);

module.exports = router;