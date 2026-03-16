import { Router } from "express";
import { claimController } from "../../controllers/claim/controller.js";
import { roleController } from "../../controllers/role/controller.js";
import { verifyToken, authorizeClaim } from "../../middleware/authMiddleware.js";

const router = Router();

// Các API này thường chỉ dành cho Admin hệ thống
router.get("/claims", verifyToken, authorizeClaim('admin'), claimController.getAll);
router.post("/claims", verifyToken, authorizeClaim('admin'), claimController.create);

router.get("/roles", verifyToken, authorizeClaim('admin'), roleController.getAll);
router.post("/roles", verifyToken, authorizeClaim('admin'), roleController.create);

export const rbacRouter = router;