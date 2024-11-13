import express from 'express';
import dotenv from 'dotenv';
import dbConnect, {client} from './Config/db';
import cors from 'cors';
import userRouetr from './Router/userRouter';
import adminRouter from './Router/adminRouter'
import cookieParser from 'cookie-parser';
const app = express()
dotenv.config()

dbConnect().then(()=> console.log("Connected suuccessfullt SQL Database"));


app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.use(express.static('public'))
app.use("/user",userRouetr)
app.use("/admin",adminRouter)

const PORT = process.env.PORT || 3000;



app.listen(PORT,()=>{

     console.log(`http://localhost:${PORT}`)
     
})