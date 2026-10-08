const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/userModels");
const { registerSchema, loginSchema } = require("../validators/authValidators");
const { sendVerificationEmail } = require("../utils/sendMails");

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details(0).message });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exist" });
        }

        const hashedPassword = await bcrypt.createHash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const hashedVerificationToken = crypto.createHash("sha256")
            .update(verificationToken)
            .digest("hex")

        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({
            firstName, lastName, email,
            password: hashedPassword,
            emailVerificationToken: hashedVerificationToken,
            emailVerificationExpires: verificationExpires
        });

        await sendVerificationEmail(email, verificationToken);

        return res.status(201).json({
            message: "User Created Successfully. Please Verify Your Email.",
            user: user._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: "Verification Token is required" })
        }

        const hashedVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

        const user = await User.findOne({ emailVerificationToken: hashedVerificationToken });

        if (!user) {
            return res.status(400).json({ message: "Invalid Verification Token" })
        }

        if (user.emailVerificationExpires < new Date()) {
            return res.status(400).json({ message: "Verification token has expired" })
        }

        user.isVerified = true,
            user.emailVerificationToken = null,
            user.emailVerificationExpires = null

        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details(0).message });
        };

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "invalid email address" })
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email address" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect/invalid password" });
        }

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: "1h" },
        );

        return res.status(200).json({ message: "Login successfull", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, verifyEmail, login };