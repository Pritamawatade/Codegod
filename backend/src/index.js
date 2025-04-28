import express from "express";
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser"
import problemRouter from "./routes/problems.routes.js";
import executionRoute from "./routes/executeCode.route.js";

const app = express();
dotenv.config();

app.use(cookieParser())
app.use(express.json())

app.use('/api/v1/users', authRouter)
app.use('api/v1/problems', problemRouter)
app.use('api/v1/execute-code', executionRoute )

const port = process.env.PORT || 8080;




app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
    
})