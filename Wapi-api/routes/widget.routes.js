import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { uploader } from '../utils/upload.js';
import * as widgetController from '../controllers/widget.controller.js';

const router = express.Router();

const widgetUpload = uploader('widgets').fields([
    { name: 'widget_image', maxCount: 1 },
    { name: 'body_background_image', maxCount: 1 },
]);

router.post('/', authenticate, ...widgetUpload, widgetController.createWidget);
router.put('/:id', authenticate, ...widgetUpload, widgetController.updateWidget);
router.delete('/:id', authenticate, widgetController.deleteWidget);
router.post('/bulk-delete', authenticate, widgetController.bulkDeleteWidgets);

router.get('/', authenticate, widgetController.getAllWidgets);
router.get('/phone/:phoneNumber', authenticate, widgetController.getWidgetByPhoneNumber);
router.get('/:id', widgetController.getWidgetById);

export default router;
