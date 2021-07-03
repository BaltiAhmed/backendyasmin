const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const schema = mongoose.Schema;

const adminScema = new schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlenght: 8 },

});

adminScema.plugin(uniqueValidator);

module.exports = mongoose.model("admin", adminScema);
