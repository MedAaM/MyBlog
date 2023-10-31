const router = require ('express').Router();
const {registerUser, loginUser, verifyUserAccountCtrl} = require ('../controller/authController')


///  api/auth/register
router.post('/register' , registerUser)
///  api/auth/login
router.post('/login' , loginUser)

// /api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);

module.exports = router