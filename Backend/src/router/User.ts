import express from "express";
import { getAllUsers, getUserDetails, loginUser, registerUser, updateUserDetails } from "../controller/User.controller.js";
import { LoginCheck } from "../Middleware/LoginCheck.js";
import { upload } from "../multer.js";

const router = express.Router();

router.get("/getuserdetails",LoginCheck ,getUserDetails)
router.get("/user/all",LoginCheck ,getAllUsers)
router.put("/updateuserdetails",LoginCheck,upload.single("profilepic") ,updateUserDetails)
router.post("/login/user",loginUser)
router.post("/register/user",registerUser)

export default router;