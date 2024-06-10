import dotenv from "dotenv";
import connetDB from "./db/index.js";  // jevha default export krto theva {} ya way ne import kru nye
import app from "./app.js";

dotenv.config({
    path : './.env'
})

connetDB()
.then(()=>{
    app.listen(process.env.PORT || 8000)
    console.log(`app is listning on port ${process.env.PORT}`)
})
.catch(()=>{
    console.log("db connection issue")
})
