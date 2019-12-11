const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //   console.log(req.body);
    res.send("User route");
  }
);

module.exports = router;
