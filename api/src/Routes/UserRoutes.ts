import express from 'express';
import { userController } from '../Controllers/UserController';
import { authMiddleware } from '../Middlewares/AuthMiddleware';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', authMiddleware, userController.getUsers);

export default router;
