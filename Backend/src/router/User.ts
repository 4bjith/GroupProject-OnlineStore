import express from "express";
import { getUserDetails, loginUser, registerUser, updateUserDetails } from "../controller/User.controller.js";
import { LoginCheck } from "../Middleware/LoginCheck.js";
import { upload } from "../multer.js";

const router = express.Router();

router.get("/getuserdetails",LoginCheck ,getUserDetails)
router.put("/updateuserdetails",LoginCheck,upload.single("profilepic") ,updateUserDetails)
router.post("/loginuser",loginUser)
router.post("/registeruser",registerUser)

export default router;