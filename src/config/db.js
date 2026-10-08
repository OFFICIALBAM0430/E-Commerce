const mongoose = require("mongoose");
require("dotenv").config();

const eventHorizonDbUrl = process.env.EVENT_HORIZON_DB_URL;

const eventHorizonDB = async (req, res) => {
    try {
        await mongoose.connect(eventHorizonDbUrl);
        console.log("Connected to EventHorizon Database Successfully");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = eventHorizonDB;