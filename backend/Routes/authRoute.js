import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmailHandler,
  forgetpassword,
  resetpassword,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/register",upload.single("image"),registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser)
router.get("/verify-email", verifyEmailHandler);
router.post("/forgetpassword", forgetpassword);
router.post("/resetpassword", resetpassword);
router.get("/me",verifyToken,getCurrentUser);
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
