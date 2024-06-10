import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config(
    {
        api_key : process.env.CLOUDINARY_API_KEY,
        cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
        api_secret : process.env.CLOUDINARY_API_SECRETE
    }
)

const uploadFileOncloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath){
            console.log("no loacl file path")
        }

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"
        })

        if(!response){
            console.log("error while uploading on cloudinary")
        }

        console.log("file uploaded successfully on cloudinary ", response)

        fs.unlinkSync(localFilePath)

        return response;
        
    } catch (error) {
        console.log("error while uploading on cloudinary")

        if(localFilePath){
            try {
                await fs.promises.unlink(localFilePath)
            } catch (error) {
                console.log(error)
            }
        }

        return null;
    }
}

export {uploadFileOncloudinary};