const mongoose = require("mongoose");
const schema = mongoose.Schema;

const planAffaireSchema = new schema({
  description: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model("planAffaire", planAffaireSchema);