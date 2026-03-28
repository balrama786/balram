import express from 'express';
import {
  getWABACatalogs,
  syncWABACatalogs,
  linkCatalogToWABA,
  getLinkedCatalogs,
  getProductsFromCatalog,
  createProductInCatalog,
  getUserCatalogs,
  getUserProducts,
  deleteProductFromCatalog,
  updateProductInCatalog
} from '../controllers/ecommerce-catalog.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/waba/:waba_id/catalogs', authenticate, getWABACatalogs);

router.post('/waba/:waba_id/sync-catalogs', authenticate, syncWABACatalogs);

router.post('/link-catalog', authenticate, linkCatalogToWABA);

router.get('/waba/:waba_id/linked-catalogs', authenticate, getLinkedCatalogs);

router.get('/catalog/:catalog_id/products', authenticate, getProductsFromCatalog);

router.post('/catalog/:catalog_id/products', authenticate, createProductInCatalog);

router.get('/user/catalogs', authenticate, getUserCatalogs);

router.get('/user/products', authenticate, getUserProducts);

router.put('/catalog/:catalog_id/products/:product_id', authenticate, updateProductInCatalog);

router.delete('/catalog/:catalog_id/products/:product_id', authenticate, deleteProductFromCatalog);

export default router;
