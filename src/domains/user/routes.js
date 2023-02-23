const express = require("express");
const { createNewUser } = require("./controller");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!(name && email && password)) {
      throw Error("Empty input fields");
    } else if (password.length < 8) {
      throw Error("Password is too short!");
    } else {
      const newUser = await createNewUser({
        name,
        email,
        password,
      });
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(400).send(error.message)
  }
});

module.exports = router;
