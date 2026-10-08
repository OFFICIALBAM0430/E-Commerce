const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const eventHorizonDB = require("./src/config/db");

const app = express();

const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("EventHorizon Demo API is running")
});

eventHorizonDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});