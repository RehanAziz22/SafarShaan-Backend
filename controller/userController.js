const bcrypt = require('bcryptjs');
const userModel = require("../model/userSchema.js");
const otpModel = require("../model/otpSchema.js");
const otpGenerator = require("otp-generator")
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
// const twilio = require("twilio")
const { response } = require('express');
const mongoose = require("mongoose");
// const sendMail = require("./sendMail.js");
require('dotenv').config();
// const accountSid = "AC3527f60cf55606add423c4a531957524";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioClient = new twilio(accountSid, authToken);

const UserController = {

    userSignUpMobileNumber: async (request, response) => {
        try {
            console.log(request.body);

            const { mobileNumber } = request.body;

            if (!mobileNumber) {
                return response.json({
                    message: 'Required fields are missing',
                    status: false,
                });
            }
            const objToSend = {
                mobileNumber: mobileNumber,
                category: "user",
                is_verified: false
            };

            const existingUser = await userModel.findOne({ mobileNumber });

            if (existingUser) {
                return response.json({
                    message: 'Phone Number already exists Please use another',
                    status: false,
                });
            }

            const user = await userModel.create(objToSend);
            const otp = 1234
            // const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false, digits: true })
            const cDate = new Date();
            await otpModel.findOneAndUpdate(
                { mobileNumber },
                { otp, otpExpiration: new Date(cDate.getDate()) },
                { upsert: true, new: true, setDefaultOnInsert: true }
            )

            return response.status(200).json({
                success: true,
                msg: "OTP Send Successfully",
                user
            })
        }
        catch (error) {
            console.error(error);
            return response.json({
                message: 'Internal server error',
                status: false,
            });
        }
    },
    genUserPin: async (request, response) => {
        try {
            const { id, pin } = request.body

            if (!pin) {
                return response.status(400).json({ // Use a more specific error code
                    message: 'Pin is required.',
                    status: false,
                });
            } else if (pin.length < 4) {
                return response.status(400).json({
                    message: 'Pin must be at least 4 digits long.',
                    status: false,
                });
            } else if (pin.length > 4) {
                return response.status(400).json({
                    message: 'Pin cannot exceed 4 digits.',
                    status: false,
                });
            }
            const hashPin = await bcrypt.hash(pin, 10);
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { $set: { id, pin: hashPin } },
                { new: true } // Return the updated user document
            );

            if (!updatedUser) {
                return response.json({
                    message: 'User not found',
                    status: false,
                });
            }

            return response.json({
                message: 'Pin successfully create and updated to DB ' + pin,
                status: true,
                data: hashPin
            });
        } catch (error) {
            console.error(error);
            return response.json({
                message: 'Internal server error',
                status: false,
            });
        }
    },
    // email verificatin 
    // userSignUp4: async (request, response) => {
    //     try {
    //         console.log(request.body);

    //         const { firstName, lastName, category, email, password, mobileNumber } = request.body;

    //         if (!firstName || !lastName || !email || !password || !mobileNumber || !category) {
    //             return response.json({
    //                 message: 'Required fields are missing',
    //                 status: false,
    //             });
    //         }

    //         const hashPassword = await bcrypt.hash(password, 10);

    //         const objToSend = {
    //             first_name: firstName,
    //             last_name: lastName,
    //             email,
    //             password: hashPassword,
    //             mobileNumber: mobileNumber,
    //             category,
    //             is_verified: false
    //         };

    //         const existingUser = await userModel.findOne({ email });

    //         if (existingUser) {
    //             return response.json({
    //                 message: 'Email already exists',
    //                 status: false,
    //             });
    //         }

    //         const newUser = await userModel.create(objToSend);

    //         async function sendVerificationEmail(userName, userEmail, user_id) {
    //             // connect with the smtp
    //             let transporter = await nodemailer.createTransport({
    //                 host: "smtp.ethereal.email",
    //                 port: 587,
    //                 auth: {
    //                     user: 'sebastian.collins45@ethereal.email',
    //                     pass: 'AYYN11tgFsRJ9AvG21'
    //                 },
    //             });
    //             try {
    //                 let info = await transporter.sendMail({
    //                     from: '"Vinod Thapa 👻" <thapa@gmail.com>', // sender address
    //                     to: userEmail, // list of receivers
    //                     subject: "Email Verification", // Subject line
    //                     text: "Hello YT Thapa", // plain text body
    //                     html: `<h1>HI ${userName} Please click here to <a href="http://localhost:8000/api/verify?id=${user_id}"> Verify</a> your mail</h1> `, // html body
    //                 });

    //                 // console.log("Message sent: %s", info.messageId);
    //                 console.log("Verification email sent to", userEmail);
    //                 // res.json(info);
    //             } catch (error) {
    //                 console.error("Error sending verification email:", error);
    //             }
    //         }

    //         await sendVerificationEmail(firstName, newUser.email, newUser._id);

    //         return response.json({
    //             message: 'Please verify your email to complete signup',
    //             status: true,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return response.json({
    //             message: 'Internal server error',
    //             status: false,
    //         });
    //     }
    // },
    verifyMail: async (req, res) => {
        try {

            const updateInfo = await userModel.updateOne({ _id: req.query.id }, { $set: { is_verified: true } })
            console.log(updateInfo)
            res.render("email-verified");
        } catch (error) {
            console.log(error)
        }
    },
    // userSignUp: async (request, response) => {
    //     try {
    //         console.log(request.body);

    //         const { firstName, lastName, category, email, password, mobileNumber } = request.body;

    //         if (!firstName || !lastName || !email || !password || !mobileNumber || !category) {
    //             return response.json({
    //                 message: 'Required fields are missing',
    //                 status: false,
    //             });
    //         }

    //         const hashPassword = await bcrypt.hash(password, 10); // Use async/await for bcrypt

    //         const objToSend = {
    //             first_name: firstName,
    //             last_name: lastName,
    //             email,
    //             password: hashPassword,
    //             mobileNumber: mobileNumber,
    //             category,
    //         };

    //         const existingUser = await userModel.findOne({ email }); // Use async/await for findOne

    //         if (existingUser) {
    //             return response.json({
    //                 message: 'Email already exists',
    //                 status: false,
    //             });
    //         }

    //         const newUser = await userModel.create(objToSend); // Use async/await for create
    //         console.log(newUser.email)
    //         const sendMail = async (req, res) => {
    //             let testAccount = await nodemailer.createTestAccount();

    //             // connect with the smtp
    //             let transporter = await nodemailer.createTransport({
    //                 host: "smtp.ethereal.email",
    //                 port: 587,
    //                 auth: {
    //                     user: 'sebastian.collins45@ethereal.email',
    //                     pass: 'AYYN11tgFsRJ9AvG21'
    //                 },
    //             });

    //             let info = await transporter.sendMail({
    //                 from: '"Vinod Thapa 👻" <thapa@gmail.com>', // sender address
    //                 to: newUser.email, // list of receivers
    //                 subject: "Email Verification", // Subject line
    //                 text: "Hello YT Thapa", // plain text body
    //                 html: "<b>Hello YT Thapa</b>", // html body
    //             });

    //             console.log("Message sent: %s", info.messageId);
    //             res.json(info);
    //         };

    //         if (sendMail) {

    //             return response.json({
    //                 message: 'User successfully signed up',
    //                 status: true,
    //                 user: newUser,
    //             });
    //         } else {
    //             return response.json({
    //                 message: 'Please Verify Your Mail',
    //                 status: false,
    //                 user: newUser,
    //             });
    //         }
    //     } catch (error) {
    //         console.error(error); // Log the error for debugging
    //         return response.json({
    //             message: 'Internal server error',
    //             status: false,
    //         });
    //     }
    // },
    userLoginViaPhone: async (request, response) => {
        try {
            // console.log(request.body, "request.body");

            const { mobileNumber } = request.body;

            if (!mobileNumber) {
                return response.json({
                    message: 'Required fields are missing',
                    status: false,
                });
            }

            const user = await userModel.findOne({ mobileNumber: mobileNumber }); // Use async/await for findOne

            if (!user) {
                return response.json({
                    message: 'Phone no doest not registered',
                    status: false,
                });
            }
            return response.json({
                message: 'Phone number matched',
                status: true,
                user,
            });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return response.json({
                message: 'Internal server error',
                status: false,
            });
        }
    },
    verifyUserPin: async (request, response) => {
        try {
            // console.log(request.body, "request.body");

            const { id, pin } = request.body;



            const user = await userModel.findOne({ _id:id }); // Use async/await for findOne
            console.log(user)
            const isPinMatch = await bcrypt.compare(pin, user.pin); // Use async/await for compare

            if (!isPinMatch) {
                return response.json({
                    message: 'Invalid Pin',
                    status: false,
                });
            }

            return response.json({
                message: 'User successfully logged in',
                status: true,
                user,
            });
        }
        catch (error) {
            console.error(error); // Log the error for debugging
            return response.json({
                message: 'Internal server error',
                status: false,
            });
        }
    },
    // userLogin: async (request, response) => {
    //     try {
    //         console.log(request.body, "request.body");

    //         const { email, password } = request.body;

    //         if (!email || !password) {
    //             return response.json({
    //                 message: 'Required fields are missing',
    //                 status: false,
    //             });
    //         }

    //         const user = await userModel.findOne({ email }); // Use async/await for findOne

    //         if (!user) {
    //             return response.json({
    //                 message: 'Invalid credentials',
    //                 status: false,
    //             });
    //         }

    //         const isPasswordMatch = await bcrypt.compare(password, user.password); // Use async/await for compare

    //         if (!isPasswordMatch) {
    //             return response.json({
    //                 message: 'Invalid credentials',
    //                 status: false,
    //             });
    //         }

    //         return response.json({
    //             message: 'User successfully logged in',
    //             status: true,
    //             user,
    //         });
    //     } catch (error) {
    //         console.error(error); // Log the error for debugging
    //         return response.json({
    //             message: 'Internal server error',
    //             status: false,
    //         });
    //     }
    // },
    singleUserGet: async (request, response) => {
        try {
          const {id} = request.query; // Assuming you're using `id` from the query string
      
        //   Validate ID format (optional, but recommended for security)
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.json({
              message: 'Invalid user ID format',
              status: false,
            });
          }
      
          const user = await userModel.findById(id); // Use await to wait for the promise
      
          if (user) {
            console.log("data", user); // User data will be in `user` variable
            response.json({
              message: 'User successfully retrieved',
              data: user,
              status: true,
            });
          } else {
            response.json({
              message: 'User not found',
              status: false,
            });
          }
        } catch (error) {
          console.error(error); // Log the error for debugging
          response.json({
            message: 'Internal error',
            status: false,
          });
        }
      },
      
    // userCreate: async (request, response) => {
    //     try {
    //         // console.log(request.body)
    //         const { firstName, lastName, email, password, category } = request.body;

    //         if (!firstName || !lastName || !email || !password || !category) {
    //             response.json({
    //                 message: `Required fields are missing`,
    //                 status: false,
    //             });
    //             return;
    //         }

    //         const objToSend = {
    //             first_name: firstName,
    //             last_name: lastName,
    //             email: email,
    //             password: password,
    //             category: category,

    //         }

    //         const user = await userModel.create(objToSend);

    //         return response.json({
    //             message: 'User successfully created',
    //             data: user,
    //             status: true,
    //         });
    //     } catch (error) {
    //         console.error(error); // Log the error for detailed debugging

    //         let errorMessage = 'Internal server error';
    //         if (error.code && error.code === 11000) { // Check for duplicate key error
    //             errorMessage = 'User with this email already exists';
    //         }

    //         return response.json({
    //             message: errorMessage,
    //             status: false,
    //         });
    //     }
    // },

    userUpdate: async (request, response) => {
        try {
            const { id, firstName, email, } = request.body;

            if (!id || !firstName  || !email ) {
                return response.json({
                    message: 'Required fields are missing',
                    status: false,
                });
            }

            const objToSend ={
                first_name:firstName,
                email
            }
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { $set: objToSend },
                { new: true } // Return the updated user document
            );

            if (!updatedUser) {
                return response.json({
                    message: 'User not found',
                    status: false,
                });
            }

            return response.json({
                message: 'User successfully updated',
                data: updatedUser,
                status: true,
            });
        } catch (error) {
            console.error(error);
            return response.json({
                message: 'Internal server error',
                status: false,
            });
        }
    },
    userDelete: async (request, response) => {
        try {
            const { id } = request.body;

            if (!id) {
                return response.json({
                    message: 'User ID is required',
                    status: false,
                });
            }

            const deletedUser = await userModel.findByIdAndDelete(id);

            if (!deletedUser) {
                return response.json({
                    message: 'User not found',
                    status: false,
                });
            }

            return response.json({
                message: 'User successfully deleted',
                status: true,
            });
        } catch (error) {
            console.error(error);
            return response.json({
                message: 'Internal server error',
                status: false,
            });
        }
    },
    // sendOTP: async (req, res) => {
    //     try {
    //         const { mobileNumber } = req.body;

    //         // Validate phone number format (optional)
    //         // You can use a regular expression or a validation library to ensure the phone number is in the expected format.

    //         // Generate OTP
    //         const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false, digits: true });

    //         const cDate = new Date();

    //         await otpModel.findOneAndUpdate(
    //             { mobileNumber }, // Find document with matching phone number
    //             { otp, otpExpiration: new Date(cDate.getTime()) }, // Update fields
    //             { upsert: true, new: true, setDefaultOnInsert: true } // Upsert (create if not found) and return updated doc
    //         );

    //         return res.status(200).json({
    //             success: true,
    //             msg: "OTP Sent Successfully",
    //         });
    //     } catch (error) {
    //         console.error("Error sending OTP:", error);
    //         return res.status(400).json({
    //             success: false,
    //             msg: "Something went wrong. Please try again later.", // Generic error message for user
    //         });
    //     }
    // },


}

module.exports = UserController