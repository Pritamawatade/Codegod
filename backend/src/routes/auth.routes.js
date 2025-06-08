import { Router } from 'express';
import {
  login,
  logout,
  check,
  register,
  changeCurrentPassword,
  updateUserAvatar,
  refresAceesToken,
  updateAccountDetails,
  googleAuthController,
  getAllUsers,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
const authRouter = Router();

authRouter.post(
  '/register',
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  register
);
authRouter.post('/google-login', googleAuthController);

authRouter.post('/login', login);
authRouter.get('/logout', authMiddleware, logout);
authRouter.get('/check', authMiddleware, check);
authRouter.post('/change-password', authMiddleware, changeCurrentPassword);

authRouter.post(
  '/change-avatar',
  authMiddleware,
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  updateUserAvatar
);

authRouter.post('/refreshAccessToken', authMiddleware, refresAceesToken);
authRouter.post(
  '/update-account-details',
  authMiddleware,
  upload.fields([{ name: 'avatar', maxCount: 1 }]),
  updateAccountDetails
);

authRouter.get('/get-all-users', authMiddleware, getAllUsers);



export default authRouter;
