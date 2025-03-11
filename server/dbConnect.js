const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGODB_CONNECTION_URL;

async function dbConnect() {
    try {

        await mongoose.connect(uri);
        console.log("Db Connected!");
    } catch (error) {
        console.error(error)
    }
}

module.exports = { dbConnect }