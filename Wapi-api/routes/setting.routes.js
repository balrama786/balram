import express from "express";
import {
  getAllSettings,
  updateSetting,
  testMail,
  updateStripeSettings,
  getStripeSettings,
  updateRazorpaySettings,
  getRazorpaySettings
} from "../controllers/setting.controller.js";
import { authenticateUser, authorizeAdmin } from "../middlewares/auth.js";
import { uploader } from "../utils/upload.js";

const router = express.Router();

const logoFields = [
  { name: 'favicon_url', maxCount: 1 },
  { name: 'logo_light_url', maxCount: 1 },
  { name: 'logo_dark_url', maxCount: 1 },
  { name: 'sidebar_light_logo_url', maxCount: 1 },
  { name: 'sidebar_dark_logo_url', maxCount: 1 }
];

router.route("/").get(getAllSettings).put(uploader('attachments').fields(logoFields), updateSetting);

router.post("/mail/test", authenticateUser, authorizeAdmin, testMail);

router
  .route("/stripe")
  .get(authenticateUser, authorizeAdmin, getStripeSettings)
  .put(authenticateUser, authorizeAdmin, updateStripeSettings);

router
  .route("/razorpay")
  .get(authenticateUser, authorizeAdmin, getRazorpaySettings)
  .put(authenticateUser, authorizeAdmin, updateRazorpaySettings);

export default router;
