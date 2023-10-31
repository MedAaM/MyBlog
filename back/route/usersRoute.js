const router = require ('express').Router();
const { getAllUsers, getUserProfile, updateUserProfile, GetUserCount, profilephotoUpload, deleteUserProfile } = require('../controller/usersController');
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAuthorization} = require('../middlewares/verifyToken');
const validateObjectId = require ('../middlewares/validateObjectId');
const photoUpload = require('../middlewares/photoUpload');



///api/users/profile
router.route ('/profile').get(verifyTokenAndAdmin ,getAllUsers)
///api/users/profile/:id
router.route ('/profile/:id').get(validateObjectId, getUserProfile)
                             .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfile) 
                             .delete(validateObjectId, verifyTokenAndAuthorization,deleteUserProfile)

///api/users/profile/profile-photo-upload
router.route ('/profile/profile-photo-upload').post(verifyToken,photoUpload.single("image"), profilephotoUpload)

///api/users/count
router.route ('/count').get(verifyTokenAndAdmin ,GetUserCount)


 



module.exports = router;