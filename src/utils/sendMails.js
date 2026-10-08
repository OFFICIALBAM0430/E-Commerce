const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendVerificationEmail = async (email, verificationToken) => {
    const verificationLink = `http:localhost:${process.env.PORT || 4500}
    /api/auth/verify-email?token=${verificationToken}`

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email Address",
        html: `<h2>Welcome to EventHorizon</h2>
            
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">
            Verify Email
            </a>
            
            <p>This verification link will expore in 10 minutes.</p>`
    });
};

module.exports = { sendVerificationEmail };