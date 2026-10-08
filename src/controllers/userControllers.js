const User = require("../models/userModels");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        return res.status(200).json({message: "Profile fetched successfully", user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = {getProfile};