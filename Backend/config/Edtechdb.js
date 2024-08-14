const mongoose = require("mongoose");
require("dotenv").config();

const connectWithMongoDB = (req, res) => {
  mongoose
    .connect(process.env.Edtech_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Databse connected succefully!");
    })
    .catch((er) => {
      console.log("Databse not connected succesfully!");
      console.error(er.message);
    });
};

module.exports = connectWithMongoDB;
