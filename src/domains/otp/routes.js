const express = require("express");
const { sendOTP, verifyOTP } = require("./controller");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, subject, message, body, duration } = req.body;
    const createdOTP = await sendOTP({
      email,
      subject,
      message,
      body,
      duration,
    });
    res.status(200).json(createdOTP);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validOTP = await verifyOTP({ email, otp });
    res.status(200).json({ valid: validOTP });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
