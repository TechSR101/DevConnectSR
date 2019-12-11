//all MongoDB connections related

const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true, // to Avoid DeprecationWarning
      useNewUrlParser: true, // to Avoid DeprecationWarning
      useCreateIndex: true // to Avoid DeprecationWarning
    }); // Because mongoose.connect return a promise we wanna put await

    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
