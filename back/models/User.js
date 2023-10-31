const mongoose = require ('mongoose')
const joi = require ('joi')
const jwt = require ('jsonwebtoken')
const passwordComplexity = require("joi-password-complexity");
require('dotenv').config()

//User Schema
const UserSchema = new mongoose.Schema ({
    username : { 
        type : String,
        required: true,
        trim: true, 
        minlength: 2,
        maxlength: 100,
    },
    email : {
        type : String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password : {
        type : String,
        required: true,
        trim: true,
        minlength: 8,
        
    },
    profphoto : {
        type : Object,
        default:{
            url: "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png", // men site pixabay.com
            publicId: null
        }
    },
    bio : {
        type: String,
        
    },
    isAdmin : {
        type: Boolean,
        default: false,

    },
    isAccountVerified : {
        type: Boolean,
        default: false,
        
    }
}  ,  {

    timestamps: true ,
    toJSON : {virtuals: true}, 
    toObject :  {virtuals: true}
})


UserSchema.virtual('posts' , { 
 
    ref : 'Post',
    foreignField:'user',
    localField : '_id'
})



// Generate Auth token
UserSchema.methods.generateAuthToken = function () {
     return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT, {
        expiresIn : '30d'
     })

}
//User Model
const User = mongoose.model('User',UserSchema);

// validate Register User 
function validateRegUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),  
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),

    });
    return schema.validate(obj) 
}

// validate login User
function validateLogUser(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required(),

    });
    return schema.validate(obj)
}

// Validate Email
function validateEmail(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
    });
    return schema.validate(obj);
}

// Validate New Password
function validateNewPassword(obj) {
    const schema = joi.object({
        password: passwordComplexity().required(),
    });
    return schema.validate(obj);
}

// validate update User
function validateUpdateUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100),
        password: joi.string().trim().min(8),
        bio : joi.string(),

    });
    return schema.validate(obj) // return : obj fih error prop
}
module.exports = {
    User,
    validateRegUser,
    validateLogUser,
    validateUpdateUser,
    validateEmail,
    validateNewPassword
}

