import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/Database.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/v1",userRoute);

app.get("/",(req,res)=>{
    res.send("API is working...")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port no ${PORT}`)
})
