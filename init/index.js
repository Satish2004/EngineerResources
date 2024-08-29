const mongoose = require("mongoose");
const initData = require("./data.js"); // Adjust path as necessary
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonder";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    await initDB();
  } catch (err) {
    console.error(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

main();
