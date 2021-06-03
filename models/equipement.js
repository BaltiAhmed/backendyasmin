const mongoose = require("mongoose");
const schema = mongoose.Schema;

const equipementSchema = new schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  prix: { type: String, required: true },
  quantite: { type: String, required: true },
});

module.exports = mongoose.model("equipement", equipementSchema);
