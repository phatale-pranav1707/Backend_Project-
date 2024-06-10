import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

 const connetDB = async()=>{
   try {
     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
 
     console.log("mongo db is connected")
   } catch (error) {
       console.log("mongodb connection error");
       process.exit(1);
   }
}

export default connetDB;



