const fs = require('fs')
const path = require ('path')
const {Post, validateCreatePost, validateUpdatePost} = require ('../models/Post')
const asyncHandler = require('express-async-handler')
const {cloudinaryUploadImage, cloudinaryRemoveImage} =  require ('../utils/cloudinary')
const { Comment } = require("../models/Comment");




/*-----------------------------
  * @desc create new Post 
    @router: api/posts
    @method :Post
    @access: private (only logged in User) 
    ---------------------------  */

 module.exports.createPost = asyncHandler(async (req,res) => {
    // validation for image
    if(!req.file) {
        return res.status(400).json({message : 'no image provided'})
    }
    // validation for data
    const {error} = validateCreatePost(req.body) 
    if(error) {
        return res.status(400).json({message : error.details[0].message})
    }
    //uPLOAD pHOTO
    const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(imagePath)
    // create new post and save it in DB
    /*Comment !impor
    const post1 = new Post({
        title : req.body.title,
    });
    await post1.save //lezem menha ki neste3mlu ter9a hedhi lezem save
    
    */
    const post = await Post.create({
      title : req.body.title,   
      description : req.body.description,
      category :req.body.category,
      user: req.user.id,  // hne me reque.user.id
        image : {
          url: result.secure_url,
          publicId: result.public_id,
        }
      
      
    })
    //send response to the client
    res.status(201).json(post);
    // remove image from server   
    fs.unlinkSync(imagePath);    
 })

 /*-----------------------------
  * @desc Get All Posts 
    @router: api/posts
    @method :Get
    @access: public
    ---------------------------  */

    module.exports.getAllPosts = asyncHandler(async (req,res) => {
      const Post_Per_Page = 3
       const {pageNumber , category} = req.query
       let posts;
        if (pageNumber) {
          posts = await Post.find()
                .skip((pageNumber - 1) * Post_Per_Page)  //bedi e3ti lel user post hesb page number
                .limit(Post_Per_Page)
                .sort ({createdAt: -1})
                .populate("user" , ["-password"])
        }
        else if (category) {
          posts = await Post.find({category : category}).sort ({createdAt: -1})
                                                        .populate("user" , ["-password"])// we can write posts = await Post.find({category})
        }
        else {
          posts = await Post.find().sort ({createdAt: -1}).populate("user" , ["-password"])
        }
        res.status(200).json(posts)
   })



   

    /*-----------------------------
  * @desc Get single Posts 
    @router: api/posts/:id
    @method :Get
    @access: public
    ---------------------------  */

    module.exports.getSignlePost = asyncHandler(async (req,res) => {
        const post = await Post.findById(req.params.id).populate("user" , ["-password"]).populate('comments')
        if(!post) {
          return res.status(404).json({message : 'post not found'})
        }
        res.status(200).json(post)
   })

    /*-----------------------------
  * @desc Get Posts Count 
    @router: api/posts/count
    @method :Get
    @access: public
    ---------------------------  */

    module.exports.getPostcount = asyncHandler(async (req,res) => {
      const count = await Post.count()
      res.status(200).json(count)
 })

   /**-----------------------------
    @desc  Delete Post
    @router: api/posts/:id
    @method :Delete
    @access: provate (only admin or the owner of the post)
    ---------------------------  **/

    module.exports.deletePost= asyncHandler(async (req,res) => {
      const post = await Post.findById(req.params.id)
      if(!post) {
        return res.status(404).json({message : 'post not found'})
      }

      //authorization access
      if ((req.user.isAdmin) || (req.user.id === post.user.toString() ) ) { 
      await Post.findByIdAndDelete(req.params.id)
       // delete the image in cloudinary
       await cloudinaryRemoveImage(post.image.publicId)
       //@TODO : deleta all comments that belong to this post
       await Comment.deleteMany({ postId: post._id }); 

       res.status(200).json({message : "post has been deleted successfully" , 
                             postId : post._id})
      }

      else {
        res.status(403).json({message: 'access denied authorization'})
      }

 })

   /**-----------------------------
    @desc  Update Post
    @router: api/posts/:id
    @method :Put
    @access: private (only owner of the post)
    ---------------------------  **/ 

    module.exports.updatePost = asyncHandler(async (req,res) => {
      //1: Validation
     const {error} = validateUpdatePost(req.body)
      if (error) {
        return res.status(400).json ({message : error.details[0].message})
      }
     //2: Get the post from the Db and check if the post exist
     const post = await Post.findById(req.params.id);
     if (!post) {
        return res.status(404).json({message : 'post not found'})
     }
     //3: check if this post belongs to the post owner (authorization)
     if (req.user.id !== post.user.toString()) {
       return res.status(403).json({message: 'access denied you are not allowed'})
     }
     // 4: Update Post
     const updatedPost = await Post.findByIdAndUpdate(req.params.id , {
      $set : {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
      }
     }, { new : true}).populate('user', ["-password"])

     //5: send res to the client
     res.status(200).json(updatedPost)
    } )



    /**-----------------------------
    @desc  Update Post Image
    @router: api/posts/upload-image/:id
    @method :Put
    @access: private (only owner of the post)
    ---------------------------  **/ 

    module.exports.updatePostImage = asyncHandler(async (req,res) => {
      //1: Validation
      if (!req.file) {
        return res.status(400).json ({message :"no image provided"})
      }
     //2: Get the post from the Db and check if the post exist
     const post = await Post.findById(req.params.id);
     if (!post) {
        return res.status(404).json({message : 'post not found'})
     }
     //3: check if this post belongs to the post owner (authorization)
     if (req.user.id !== post.user.toString()) {
       return res.status(403).json({message: 'access denied you are not allowed'})
     }
     // 4: delete the old Image
     await cloudinaryRemoveImage(post.image.publicId)
     
     //5: opload new post image
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
      const result = await cloudinaryUploadImage(imagePath);
      //6: update image field in the db
      const updatedPost = await Post.findByIdAndUpdate(req.params.id , {
        $set : {
         image : {
          url : result.secure_url,
          publicId : result.public_id,
         }
        }
       }, {new : true})
     //7: send res to the client
     res.status(200).json(updatedPost)
     //8: delete the image from server
     fs.unlinkSync(imagePath)
    } )

       /**-----------------------------
    @desc  Toggle Like
    @router: api/posts/like/:id
    @method :Put
    @access: private (only logged in User)
    ---------------------------  **/ 

    module.exports.toggleLike = asyncHandler(async (req,res) => {

      const loggedInUser = req.user.id;
       let post = await Post.findById(req.params.id);
       if (!post) {
        return res.status(404).json({message: 'post not found'})
       }

       const isPostAlreadyLiked = post.likes.find(user => {
        user.toString() === loggedInUser
       })

       if(isPostAlreadyLiked) {
        post = await Post.findByIdAndUpdate(req.params.id , {
          $pull: { //hedhe pull fi mongoose ye9der delete value men array(yechte8l ken 3al arrays)
            likes: loggedInUser  // bch yfese5 loggesInuser (id) men likes array
          }} , {new : true})
       }

       else {
        post = await Post.findByIdAndUpdate(req.params.id , {
          $push: { //hedhe push fi mongoose ye9der yzid value fi array(yechte8l ken 3al arrays)
            likes: loggedInUser  // bch yzid loggesInuser (id) fel likes array
          }} , {new : true})
       }

       res.status(200).json(post)
    } )
