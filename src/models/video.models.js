import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    videofile : {
        type : String,
        required : true
    },

    thumbnail : {
        type : String,
        required : true,
    },

    title : {
        type : String,
        required : true,
    },

    description : {
        type : String,
        required : true,
    },

    publishedAt : {
        type : String,
        required : true,
    },

    views : {
        type : Number,
        required : true,
    },

    description :{
        type : String ,
        required : true,
     },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }


})

export const Video = mongoose.model("Video", videoSchema)