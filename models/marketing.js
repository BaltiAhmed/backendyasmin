const mongoose = require("mongoose");
const schema = mongoose.Schema;

const marketingSchema = new schema({
  type: { type: String, required: true },
  cout: { type: String, required: true },
  duree: { type: String, required: true },
});

module.exports = mongoose.model("marketing", marketingSchema);
