const express = require("express");
const router = express.Router();
const gravatar = express("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../api/models/Users");

// @route           POST api/users
// @description     Register user
// @access          Public

router.post(
  "/",
  [
    // checking the validation
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(), // username must be an email
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }) // password must be at least 5 chars long
  ],
  async (req, res) => {
    // anything that returns promise we have to use await,in order to use async way we have to use async keyword
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // every time we make a get request we can access vis req.body.name,  req.body.email so to avoid that every time i'm going to destructure out the few things
    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar
      //            NOT WORKING NEED TO FIXED LATER
      //   const avatar = gravatar.url(email, {
      //     s: "200", // size
      //     r: "pg", // rating
      //     d: "mm" // default
      //   });

      user = new User({
        name,
        email,
        // avatar,  NOT WORKING
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save(); // because user.save gives us promise so ew use await

      // Return jsonwebtoken

      res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
