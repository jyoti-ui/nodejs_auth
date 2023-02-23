const nodemailer = require("nodemailer");
const {AUTH_EMAIL, AUTH_PASS} = process.env

let tranporter = nodemailer.createTransport({
    service: "Gmail",
    auth : {
        user: AUTH_EMAIL,
        pass: AUTH_PASS
    }
})

tranporter.verify((error, success) => {
    if(error) {
        console.log(error)
    } else{
        console.log("Ready for messages")
        console.log(success)
    }
})

const sendEmail = async(mailOptions) => {
    try {
        await tranporter.sendMail(mailOptions)
        return;
    }catch(error) {
        throw error;
    }
}

module.exports = sendEmail;