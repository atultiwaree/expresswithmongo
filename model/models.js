const mongoose = require("mongoose");

//Creating Schema
const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
});

//Creating Model
const Address = new mongoose.model("Address", addressSchema);

//Explorting Model module
module.exports = Address;
