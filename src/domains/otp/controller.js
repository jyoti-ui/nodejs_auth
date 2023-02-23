const generateOTP = require("../util/generateOTP");
const OTP = require("./model");
const sendEmail = require("../util/sendEmail");
const { hashData, verifyHashedData } = require("../util/hashData");
const { AUTH_EMAIL } = process.env;

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    // if (!(email && subject && message)) {
    //   throw Error("Provide values for email, subject and message");
    // }
    //clear any old record
    await OTP.deleteOne({ email });

    //generate otp
    const generateOtp = await generateOTP();

    //send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `<p>${message}</p>
      <p style="color: tomato; font-size: 25px; letter-spacing: 2px">
      <b>${generateOtp}</b></p>
      <p><b>This code expires in ${duration} hours</b></p>`,
    };

    await sendEmail(mailOptions);

    //save otp record
    const hashedOTP = await hashData(generateOtp);
    console.log(hashedOTP)
    const newOTP = await new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });

    const createdOTPRecord = await newOTP.save();
    return createdOTPRecord;
  } catch (error) {
    throw error;
  }
};

const verifyOTP = async ({ email, otp }) => {
  try {
    // if (!(email && otp)) {
    //   throw Error("Provide values for email and otp");
    // }

    const matchedOTPRecord = await OTP.findOne({ email });
    if (!matchedOTPRecord) {
      throw Error("No Otp records found");
    }

    const { expiresAt } = matchedOTPRecord;

    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw Error("Code has expired. Request for a new one.");
    }

    const hashedOTP = matchedOTPRecord.otp;
    console.log(hashedOTP)
    const validOTP = await verifyHashedData(otp, hashedOTP);
    return validOTP;
  } catch (error) {
    throw error;
  }
};

const deleteOTP = async (email) => {
  try {
    await OTP.deleteOne({ email });
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOTP, verifyOTP, deleteOTP };
