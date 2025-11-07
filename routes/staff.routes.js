const express = require("express");
const router = express.Router();
const controller = require("../controllers/staff.controller"); // Ensure correct path
const { verifyToken, permitRoles } = require("../middleware/authMiddleware"); // Fix destructuring

// Debug imports
console.log("staff.controller:", controller);
console.log("middleware:", { verifyToken, permitRoles });

// All roles that can view
router.get("/", verifyToken, permitRoles("STAFF-INPUTTER", "STAFF-AUTHORIZER", "VIEWER"), controller.getAll);
router.get("/:id", verifyToken, permitRoles("STAFF-INPUTTER", "STAFF-AUTHORIZER", "VIEWER"), controller.getById);

// Only STAFF-INPUTTER can modify records
router.post("/", verifyToken, permitRoles("STAFF-INPUTTER"), controller.create);
router.put("/:id", verifyToken, permitRoles("STAFF-INPUTTER"), controller.update);
router.delete("/:id", verifyToken, permitRoles("STAFF-INPUTTER"), controller.remove);

// Only AUTHORIZER can update status
router.patch("/:id/status", verifyToken, permitRoles("STAFF-AUTHORIZER"), controller.updateStatus);

module.exports = router;