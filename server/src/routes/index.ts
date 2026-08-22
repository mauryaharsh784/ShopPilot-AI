import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { optionalAuth, requireAuth, requireMerchant } from "../middleware/auth.js";
import * as auth from "../controllers/authController.js";
import * as products from "../controllers/productController.js";
import * as commerce from "../controllers/commerceController.js";
import * as agent from "../controllers/agentController.js";
import * as growth from "../controllers/growthController.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "shopilot-ai" });
});

router.post("/auth/register", asyncHandler(auth.registerHandler));
router.post("/auth/login", asyncHandler(auth.loginHandler));
router.post("/auth/demo", asyncHandler(auth.demoHandler));
router.get("/auth/me", requireAuth, asyncHandler(auth.meHandler));

router.get("/products", optionalAuth, asyncHandler(products.listHandler));
router.get("/products/meta", asyncHandler(products.metaHandler));
router.get("/products/:id", optionalAuth, asyncHandler(products.detailHandler));
router.post("/products/compare", optionalAuth, asyncHandler(products.compareHandler));
router.get("/search", optionalAuth, asyncHandler(products.searchHandler));
router.get("/recommendations", optionalAuth, asyncHandler(commerce.recommendationsHandler));

router.get("/cart", requireAuth, asyncHandler(commerce.getCartHandler));
router.post("/cart", requireAuth, asyncHandler(commerce.addCartHandler));
router.patch("/cart", requireAuth, asyncHandler(commerce.updateCartHandler));
router.delete("/cart/:productId", requireAuth, asyncHandler(commerce.removeCartHandler));
router.post("/cart/clear", requireAuth, asyncHandler(commerce.clearCartHandler));

router.get("/orders", requireAuth, asyncHandler(commerce.listOrdersHandler));
router.get("/orders/:id", requireAuth, asyncHandler(commerce.getOrderHandler));
router.post("/orders", requireAuth, asyncHandler(commerce.checkoutHandler));

router.get("/preferences", requireAuth, asyncHandler(commerce.getPrefsHandler));
router.put("/preferences", requireAuth, asyncHandler(commerce.putPrefsHandler));

router.post("/agent/chat", requireAuth, asyncHandler(agent.chatHandler));
router.get("/agent/conversations", requireAuth, asyncHandler(agent.conversationsHandler));
router.get("/agent/conversations/:id", requireAuth, asyncHandler(agent.conversationHandler));

router.post("/analytics/track", optionalAuth, asyncHandler(growth.trackHandler));
router.get("/analytics", requireAuth, requireMerchant, asyncHandler(growth.overviewHandler));
router.get("/growth", requireAuth, requireMerchant, asyncHandler(growth.overviewHandler));
router.post("/growth/advisor", requireAuth, requireMerchant, asyncHandler(growth.advisorHandler));
