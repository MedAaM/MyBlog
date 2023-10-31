const asyncHandler = require('express-async-handler')
const {User, validateUpdateUser} = require ('../models/User');
const bcrypt = require('bcryptjs')
const path = require ('path')
const fs = require('fs')
const {cloudinaryRemoveImage, cloudinaryUploadImage, cloudinaryRemoveMultipleImage}  = require ('../utils/cloudinary')
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");






/*-----------------------------
  * @desc Get All Users profile
    @router: api/users/profile
    @method :get
    @access: private (only admin) 
    ---------------------------  */

module.exports.getAllUsers = asyncHandler(async (req,res) => {
    
    const users = await User.find().select("-password").populate('posts'); /// yjib kol users from db(sauf password)
    res.status(200).json(users)

})

/*-----------------------------
  * @desc Get User profile
    @router: api/users/profile/:id
    @method :Get
    @access: public 
    ---------------------------  */

    module.exports.getUserProfile = asyncHandler(async (req,res) => {
    
      const user = await User.findById(req.params.id).select("-password").populate('posts'); /// jibli kol details and fields saud password
      if (!user) {
        return res.status(404).json({message: "user not found"})
      }
      res.status(200).json(user)
  
  })

  /*-----------------------------
  * @desc update User profile
    @router: api/users/profile/:id
    @method :put
    @access: private (only user itself) 
    ---------------------------  */
    module.exports.updateUserProfile = asyncHandler(async (req,res) => {

     const { error } = validateUpdateUser(req.body);
     if (error) {
      return res.status(400).json({message: error.details[0].message});
     }
    // check passw
     if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt)
     }
      //update user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set : { 
        username : req.body.username,
        password : req.body.password,
        bio : req.body.bio,
      } , 
    } , {new : true}  
    ).select("-password");

    res.status(200).json(updatedUser);
  
  })


  /*-----------------------------
  * @desc update Users count
    @router: api/users/count 
    @method :get
    @access: private (only user itself) 
    ---------------------------  */
  
       module.exports.GetUserCount = asyncHandler(async (req,res) => {
        const count = await User.count()
        res.status(200).json(count)
  })


 /*-----------------------------
  * @desc profile photo upload 
    @router: api/users/profile/profile-photo-upload 
    @method :Post
    @access: private (only logged in User) 
    ---------------------------  */
    module.exports.profilephotoUpload = asyncHandler(async (req,res) => {
      console.log(req.file)
          
    if (!req.file) {  //req.file is vide me3tenich file 
      return res.status(400).json({message : 'No file provided'})
    }
//2: Get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
//3: Upload to cloudinary
 const result = await cloudinaryUploadImage(imagePath);
 console.log(result)

const user = await User.findById(req.user.id)
//5: Delete old profile photo if exist
if(user.profphoto.publicId !== null) {
  await cloudinaryRemoveImage(user.profphoto.publicId)
}
user.profphoto = {
  url : result.secure_url,
  publicId : result.public_id
}
await user.save()
      res.status(200).json({message : 'profile photo uploaded succesfully'  ,
                            profilePhoto:  {url : result.secure_url , publicId : result.public_id} 
    })
//8 : Remove image from the server
  fs.unlinkSync(imagePath)
     })


 /*-----------------------------
  * @desc Delete user profile
    @router: api/users/profile/:id
    @method :Delete
    @access: private (only admin or user himself) 
    ---------------------------  */

  module.exports.deleteUserProfile = asyncHandler (async (req,res) => {
    //1. Get the user from Db
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({message: 'user not found'})
    }
    const posts = await Post.find({ user: user._id });
    const publicIds = posts?.map((post) => post.image.publicId);
    if(publicIds?.length > 0) {
      await cloudinaryRemoveMultipleImage(publicIds);
    }
    //5: Delete the profile picture from cloudinary
    await cloudinaryRemoveImage(user.profphoto.publicId)
    await Post.deleteMany({ user: user._id });
    await Comment.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id)
     res.status(200).json({message: 'your profile has been deleted!'})
  })