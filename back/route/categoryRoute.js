const router = require("express").Router();
const {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  deleteCategoryCtrl,
} = require("../controller/categoryController");

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/categories
router
  .route("/")
  .post(verifyTokenAndAdmin, createCategoryCtrl)
  .get(getAllCategoriesCtrl);

// /api/categories/:id
router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndAdmin, deleteCategoryCtrl);

module.exports = router;