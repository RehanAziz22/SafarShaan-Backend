const express = require('express')
const userRouter = require('./routes/users.js')
const otpRouter = require('./routes/phone-otp.js')

const app = express()


const sendMail = require("./controller/sendMail");


require("dotenv").config();
const cors = require("cors")
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const UserController = require('./controller/userController.js');
const PORT = process.env.PORT || 5000;

const DBURI = process.env.DBURI
 //"mongodb+srv://rehan:admin@cluster0.j1r6kfp.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(DBURI)
    .then((res) => console.log("mongo DB connected"))
    .catch((err) => console.log("DB ERROE", err));

//BODY-PARSER
app.use(cors())
app.use(express.json())

//all routes
app.use('/api',userRouter)
// app.use('/api',otpRouter)

app.get('/',(req,res)=>{
    res.send("test success")
})
// app.post("/api/send-otp", UserController.sendOTP)
// app.get("/mail", sendMail);
app.listen(PORT,()=>{
    console.log("server is running in " + PORT)
})

