import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    fullname : {
        type : String,
        required : true,
        index : 1
    },
    password : {
        type : String,
        required : true,
        
    },
    refreshtoken : {
        type : String,
        // required : true,
    },
    avtar : {
        type : String,
        required : true,
    },
    coverimage : {
        type : String,
    },
    whatchhistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ]





},{timestamps : true})


userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);

     next();
})

userSchema.methods.isPasswordCorrect = async function(password){

    if(!this.password){
        console.log("password is missing")
    }
    if(!password){
        console.log("your password is missing")
    }

    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullname : this.fullname
        },

        process.env.ACCESSTOKENSECRETE,

        {
            expiresIn : process.env.ACCESSTOKENEXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email,
            fullname : this.fullname
        },

        process.env.REFRESHTOKENSECRETE,

        {
            expiresIn : process.env.REFRESHTOKENEXPIRY
        }

    )
}



export const User = mongoose.model("User", userSchema);

// export {User}