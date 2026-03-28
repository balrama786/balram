import express from 'express';
import {
  getUserOrders,
  getOrderById,
  getOrdersByMessageId,
  getOrderStats,
  updateOrderStatus,
  upsertOrderStatusTemplate,
  getOrderStatusTemplates,
  bulkDeleteOrders
} from '../controllers/ecommerce-order.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/user/orders', authenticate, getUserOrders);

router.get('/user/orders/stats', authenticate, getOrderStats);

router.get('/message/:message_id/orders', authenticate, getOrdersByMessageId);

router.get('/orders/:order_id', authenticate, getOrderById);

router.put('/orders/:order_id/status', authenticate, updateOrderStatus);

router.get('/status-templates', authenticate, getOrderStatusTemplates);

router.put('/status-templates/:status', authenticate, upsertOrderStatusTemplate);

router.post('/orders/bulk-delete', authenticate, bulkDeleteOrders);

export default router;
