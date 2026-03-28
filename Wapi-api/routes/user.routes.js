import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUsers
} from '../controllers/user.controller.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticateUser, authorizeAdmin, createUser);

router.get('/', authenticateUser, authorizeAdmin, getAllUsers);

router.get('/:id', authenticateUser, authorizeAdmin, getUserById);

router.put('/:id', authenticateUser, authorizeAdmin, updateUser);

router.delete('/', authenticateUser, authorizeAdmin, deleteUsers);

export default router;

