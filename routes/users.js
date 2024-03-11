const {Router} = require('express')
const router = Router()

const UserController = require('../controller/userController')

//user credentials apis
//user signup
// router.post("/signup", UserController.userSignUp)
//user signupphonenumber
router.post("/signup", UserController.userSignUpMobileNumber)

//user generatePin
router.post("/gen-pin", UserController.genUserPin)

//user login
// router.post("/login", UserController.userLogin)
//user login Via Phone
router.post("/login", UserController.userLoginViaPhone)
//very user pin for user login
router.post("/verify-pin", UserController.verifyUserPin)

//single user get        //63d2914f4f578f168a217af1
router.get("/user/:id", UserController.singleUserGet);

//user update
router.put("/user", UserController.userUpdate);

//user create
// router.post("/user", UserController.userCreate);


//user delete
router.delete("/user", UserController.userDelete);
//mail verify
router.get("/verify",UserController.verifyMail)
module.exports = router