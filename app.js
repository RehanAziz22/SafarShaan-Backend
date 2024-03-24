const express = require('express')
const userRouter = require('./routes/users.js')
const bikeRouter = require('./routes/bike.js')
const otpRouter = require('./routes/phone-otp.js')

const app = express()


const sendMail = require("./controller/sendMail");


require("dotenv").config();
const cors = require("cors")
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const UserController = require('./controller/userController.js');
const PORT = process.env.PORT || 5000;

// const DBURI = process.env.DBURI
 //"mongodb+srv://rehan:admin@cluster0.j1r6kfp.mongodb.net/?retryWrites=true&w=majority";
const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.DBURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
}

//BODY-PARSER
app.use(cors())
app.use(express.json())

//all routes
app.use('/api',userRouter)
// app.use('/api',otpRouter)
app.use('/api',bikeRouter)

app.get('/',(req,res)=>{
    res.send("SaffarShan Working Fine")
})
// app.post("/api/send-otp", UserController.sendOTP)
// app.get("/mail", sendMail);
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on Port"+PORT);
        console.log("listening for requests");
    })
})
