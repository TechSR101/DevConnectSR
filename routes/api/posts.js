const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route           POST api/posts
// @description     Create post
// @access          Private

router.post(
  "/",
  [
    auth,
    check("text", "Text is Required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(400).send("Server Error");
    }
  }
);

// @route           GET api/posts
// @description     Get all posts
// @access          Private
router.get("/", auth, async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("Server Error");
  }
});

// @route           GET api/posts
// @description     Get post by ID
// @access          Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found " });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found " });
    }
    res.status(400).send("Server Error");
  }
});

// @route           DELETE api/posts/:id
// @description     Delete a post
// @access          Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found " });
    }

    //Check if the Owner is deleting the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Usr not Authorized " });
    }

    await post.remove();

    res.json({ msg: "Post Removed " });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found " });
    }
    res.status(400).send("Server Error");
  }
});
module.exports = router;
