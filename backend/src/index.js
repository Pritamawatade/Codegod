import express from "express";
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser"


const app = express();
app.use(cookieParser())
app.use(express.json())
app.use('/api/v1/users', authRouter)
dotenv.config();

const port = process.env.PORT || 8080;




app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
    
})