const express = require('express');
const router = express.Router();

const PostController = require('../controllers/post');
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/extract-file");

router.post("", checkAuth, extractFile, PostController.createAPost);
router.put("/:id", checkAuth, extractFile, PostController.updateAPost)
router.get("", PostController.fetchAllPosts);
router.get("/:id", PostController.fetchAPost)
router.delete("/:id", checkAuth, PostController.deleteAPost);

module.exports = router;
