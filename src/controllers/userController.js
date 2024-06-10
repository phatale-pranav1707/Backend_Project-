import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import {uploadFileOncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;

    // console.log(req.body);

    // Validate required fields
    if (!username) {
        throw new ApiError(400, "Username is required");
    }
    if (!fullname) {
        throw new ApiError(400, "Full name is required");
    }
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // Check if user already exists
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existUser) {
        throw new ApiError(401, "User already exists");
    }

    // Handle file uploads
    const avtarLocalPath = req.files?.avtar[0]?.path;
    const coverImageLocalPath = req.files?.coverimage[0]?.path;

    //   let coverImageLocalPath;

    //   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage){
    //       coverImageLocalPath=req.files.coverImage.path;
    //   }

   if(!avtarLocalPath){
    throw new ApiError(400, "Avtar file is required");
   }

   // console.log(coverImageLocalPath)

   const avtar= await uploadFileOncloudinary(avtarLocalPath)
//    const coverImage= await uploadFileOncloudinary(coverImageLocalPath)


    // Create the user
    const user = await User.create({
        username,
        email,
        password,
        fullname,
        avtar: avtar.url,
        coverimage:  avtar.url 
    });

    const createdUser = await User.findById(user._id).select("-password -refreshtoken");

    if (!createdUser) {
        throw new ApiError(400, "Something went wrong while creating the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const generateaccessrefreshtoken = async (userId)=>{
    try {

        const user= await User.findById(userId);

        const accesstoken=await user.generateAccessToken();
        const refreshtoken=await user.generateRefreshToken();

        // refreshToken db madhe save karav lagel

        user.refreshtoken=refreshtoken;
        user.save({validateBeforeSave : false});

        // console.log(accesstoken,refreshtoken)


        return {accesstoken,refreshtoken}

        
    } catch (error) {
        throw new ApiError(500, "something went wrong at access and refresh token")
    }
}

const userlogin= asynchandler(async(req,res)=>{
    const {username, email, password} = req.body;

    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }else{
        // console.log("there is username")
        // console.log(username, password,email)
    }

    const user= await User.findOne(
       { $or : [{username},{email}]}
    )

    if(!user){
        throw new ApiError(400, "user not exist")
    }

    const ispasswordcorrect = await user.isPasswordCorrect(password);
    if(!ispasswordcorrect){
        throw new ApiError(400, "password is not correct")
    }

    const {accesstoken, refreshtoken} = await generateaccessrefreshtoken(user._id);

    const loggedinuser= await User.findById(user._id).select("-password -refreshtoken")

    const options={
        httpOnly : true,
        secure : true

    }

    // console.log(accesstoken,refreshtoken)

    res.status(200)
    .cookie("accesstoken", accesstoken,options)
    .cookie("refreshtoken", refreshtoken,options)
    .json(new ApiResponse(
        200,
        {
            loggedinuser,accesstoken,refreshtoken
        },
        "user logged in sucessfully"
    ))
})

const logoutuser= asynchandler(async(req,res)=>{
    const response = await User.findByIdAndUpdate(
        req.user.id,

        {
            $set : {
                refreshtoken : undefined
            }
        },

        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    res.status(201)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(
        200,
        "user logged out successfully"
    ))
})

const refreshAccessToken = asynchandler(async(req,res)=>{
     try {
        const incomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken

        if(!incomingRefreshToken){
            throw new ApiError(400, "invlid access");
        }

        const decoded = await jwt.verify(incomingRefreshToken,process.env.REFRESHTOKENSECRETE);

        const user= await User.findById(decoded?._id).select("-password ")

        if(!user){
            throw new ApiError(400, "invlid user access")

        }

        if(incomingRefreshToken !== user?.refreshtoken){
            throw new ApiError(400, "invlid refresh token access")
        }

        const {accesstoken, refreshtoken} =generateaccessrefreshtoken(user._id);

        const options={
            httpOnly : true,
            secure : true
        }

        res.status(200)
        .cookie("accesstoken", accesstoken,options)
        .cookie("refreshtoken", refreshtoken,options)
        .json(
            new ApiResponse(
            200,
            {
                accesstoken, refreshtoken
            },

            "accessTokenm refreshed successfully "
        )
        )

        
     } catch (error) {
         throw new ApiError(400, error, "error while refresing aceess token")
     }
     
})

// console.log

const changepassword = asynchandler(async(req,res)=>{
    const {oldpassword, newpassword}= req.body;

    if(!oldpassword || !newpassword){
        throw new ApiError(400, "old and new passwords are required")
    }

    

    const user= await User.findById(req.user._id).select("-refreshtoken")

    if(!user){
        throw new ApiError(400, "invalid user access");
    }

    const ispasswordcorrect = await user.isPasswordCorrect(oldpassword);

    if(!ispasswordcorrect){
        throw new ApiError(400, "oldpassword is incorrect")
    }

    user.password=newpassword;
    user.save({validateBeforeSave : false});

    res.status(200).json(new ApiResponse(200, "password changed successfully"))
})

const getcurrrentUser = asynchandler(async(req,res)=>{
    
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(new ApiResponse(200, user, "user fetched successfully"))
})

const UpdateAccountDeatails= asynchandler(async(req,res)=>{
    const {fullname, email} = req.body;

    if(!fullname && !email){
        throw new ApiError(400, "email or fullname is required to change")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,

        {
            $set : {
                fullname : fullname,
                email : email
            }
        },
        {
            new : true    // findByIdAndUpdate he update krt v old document return krt so new use kel tr new document return krel
        }

    ).select("-password -refreshtoken")

    if(!user){
        throw new ApiError(400, "invalid access of user")
    }

    res.status(200).json(new ApiResponse(
        200,
        user,
        "updates done successfully"
    ))
})

const UpdateUserAvtar = asynchandler(async(req,res)=>{
    const avtarLocalPath = await req.file?.path;

    if(!avtarLocalPath){
        throw new ApiError(400, "avtar file is missed")
    }

    const avtar = await uploadFileOnCloudinary(avtarLocalPath);

    if(!avtar.url){
        throw new ApiError(400, "avtar not uploaded on cloudinary")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                 avtar : avtar?.url
            }
        }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Avtar updated successfully"))


})

export { registerUser, userlogin, logoutuser, refreshAccessToken, changepassword, getcurrrentUser, UpdateAccountDeatails, UpdateUserAvtar };
