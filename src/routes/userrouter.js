import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { UpdateAccountDeatails, UpdateUserAvtar, changepassword, getcurrrentUser, logoutuser, refreshAccessToken, registerUser, userlogin } from "../controllers/userController.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name : "avtar",
            maxCount : 1
        },
        {
            name : "coverimage",
            maxCount : 1
        }

    ]),
    registerUser
)

userRouter.route("/login").post(userlogin);
userRouter.route("/logout").post(VerifyJWT,logoutuser);
userRouter.route("/refresh-token").post(VerifyJWT,refreshAccessToken);
userRouter.route("/change-password").post(VerifyJWT,changepassword);
userRouter.route("/get-user").post(VerifyJWT,getcurrrentUser);
userRouter.route("/update-user-details").post(VerifyJWT,UpdateAccountDeatails);
userRouter.route("/update-user-avtar").post(VerifyJWT,UpdateUserAvtar);


export default userRouter;