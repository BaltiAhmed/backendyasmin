const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productionSchema = new schema({
  type: { type: String, required: true },
  marche: { type: String, required: true },
});

module.exports = mongoose.model("production", productionSchema);
