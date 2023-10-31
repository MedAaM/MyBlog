const jwt = require ('jsonwebtoken')
require('dotenv').config()

//// verifyToken
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization;
    if (authToken) {
        const token  =  authToken.split(' ')[1]
        try {
          const decodedPayload = jwt.verify(token, process.env.JWT)
          req.user = decodedPayload;
          next()
        }
        catch (error) {
        return res.status(401).json({message: 'invalid Token,access denied'})
        }
    }
    else {
        return res.status(401).json({message: 'no Token provided , access denied'})
    }
}

//&&&

////Verify Token and Admin
function verifyTokenAndAdmin (req,res,next) {
    verifyToken(req,res, ()=> {
        if(req.user.isAdmin) {
            next() 
        }
        else {
            return res.status(403).json({message: 'not allowed, only admin' })
        }
    })
}

////Verify Token and Only User himself
function verifyTokenAndOnlyUser (req,res,next) {
    verifyToken(req,res, () => {
        if(req.user.id === req.params.id) {
            next() 
        }
        else {
            return res.status(403).json({message: 'not allowed, only user himself' })
        }
    })
}

//verify Token and Authorization (admin and user himself)
function verifyTokenAndAuthorization (req,res,next) {
    verifyToken(req,res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next() 
        }
        else {
            return res.status(403).json({message: 'not allowed, only user himself or admin' })
        }
    })
}
module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization
}