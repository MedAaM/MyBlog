const asyncHandler = require('express-async-handler')
const bcrypt = require ('bcryptjs')
const {User ,validateRegUser,validateLogUser} = require ('../models/User')
const VerificationToken = require("../models/VerficationToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/*-----------------------------
  * @desc Register new User
    @router: api/auth/register
    @method :Post
    @access: public 
    ---------------------------  */

module.exports.registerUser = asyncHandler(async (req,res)=> {
    /// validation 
    const {error} = validateRegUser(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }
    ///is Already exist
    let user = await User.findOne({email:req.body.email});
    if (user) {
        return res.status(400).json({message: 'User Already exists'})
    }
    /// hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(req.body.password, salt);
    ///new user and save it
    user = new User({
       username : req.body.username,
       email : req.body.email,
       password: hashedPassword,
    })
    await user.save()

    // Creating new VerificationToken & save it toDB
  const verifictionToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"), //random string
  });
  await verifictionToken.save(); 

   const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verifictionToken.token}`;
  const htmlTemplate = `
  <div>
    <p>Click on the link below to verify your email</p>
    <a href="${link}">Verify</a>
  </div>`;


 await sendEmail(user.email, "Verify Your Email", htmlTemplate);

     res.status(201).json({message: 'you registered successfully, please log in'})
})

/*-----------------------------
  * @desc Login  User
    @route: api/auth/login
    @method :Post
    @access: public 
    ---------------------------  */

module.exports.loginUser = asyncHandler(async (req,res) => {
    /// validation
    const {error} = validateLogUser(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message})
    }
    /// is user exist in db
    let user = await User.findOne({email:req.body.email});
    if (!user) {
        return res.status(400).json({message: 'Invalid Email or Password'})
    }
    /// password is correct?
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordMatch) {  ///false
        return res.status(400).json({message: 'Invalid Email or Password'})
    }

    //lezem user ykun amel verification 9bel bch neetiouh token asli mte3u
    if(!user.isAccountVerified) {
        return res.status(400).json({message: 'We sent you an email please verify before log in'})
    }
  
      const token = user.generateAuthToken();
      res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profphoto,
        token,
        username: user.username,
      });
    });


    /**-----------------------------------------------
 * @desc    Verify User Account
 * @route   /api/auth/:userId/verify/:token
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
    //find user by id (url)
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).json({ message: "invalid link" });
    }
    // find verification token associated with user id (get from url)
    const verificationToken = await VerificationToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
  
    if (!verificationToken) {
      return res.status(400).json({ message: "invalid link" });
    }
   
    // set isAccount verified property to true in user doc
    user.isAccountVerified = true;
    await user.save();

   // remove verif token from db (here we find error .remove is deprecated and its now deleteOne)
   try{
     await verificationToken.deleteOne();
     console.log('successfully removed')
   }
   catch(err) {
    console.log(err)
   }
  
    res.status(200).json({ message: "Your account verified" });
  });