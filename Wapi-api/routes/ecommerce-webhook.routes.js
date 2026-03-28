import express from "express";
import {
  createWebhook,
  listWebhooks,
  getWebhook,
  updateWebhook,
  deleteWebhook,
  toggleWebhook,
  triggerWebhook,
  getWebhookStats,
  mapTemplate
} from "../controllers/ecommerce-webhook.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();


router.post("/create", authenticate, createWebhook);

router.post("/:id/map-template", authenticate, mapTemplate);

router.get("/list", authenticate, listWebhooks);


router.get("/:id", authenticate, getWebhook);


router.put("/:id", authenticate, updateWebhook);


router.delete("/:id", authenticate, deleteWebhook);


router.patch("/:id/toggle", authenticate, toggleWebhook);


router.get("/:id/stats", authenticate, getWebhookStats);


router.post("/trigger/:token", triggerWebhook);

export default router;
