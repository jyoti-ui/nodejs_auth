const express = require("express");
const { createNewUser, authenticateUser } = require("./controller");
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

router.post("/", async(req, res) => {
  try {
    let {email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if(!(email && password)) {
      throw Error("Empty credentials supplied")
    }

    const authenticatedUser = await authenticateUser({email, password})
    res.status(200).json(authenticatedUser)
  }catch(error) {
    res.send(400).send(error.message)
  }
})

module.exports = router;
