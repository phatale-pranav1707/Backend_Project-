import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const VerifyJWT = asynchandler(async (req, res, next) => {
    try {
        // Retrieve the token from the cookies
        const token = req.cookies?.accesstoken; 
        // accesstoken ch spelling che cookies set krtana hot tech asava
                                                
        if (!token) {
            console.log("No token provided");
            throw new ApiError(401, "Authorization failed: no token provided");
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESSTOKENSECRETE);
        if (!decoded) {
            console.log("Token verification failed");
            throw new ApiError(401, "Authorization failed: token verification failed");
        }

        // Find the user associated with the token
        const user = await User.findById(decoded._id).select("-password -refreshtoken");
        if (!user) {
            console.log("User not found");
            throw new ApiError(401, "Authorization failed: user not found");
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Authorization error:", error);
        throw new ApiError(401, "Authorization failed: invalid access");
    }
});

export { VerifyJWT };
