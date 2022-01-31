const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const schema = mongoose.Schema;

const financiereShcema = new schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  adresse: { type: String, required: true },
  telephone: { type: String, required: true },
  cin: { type: String, required: true },
  budget: { type: Number, required: true },
  domaine: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlenght: 8 },
  projets: [{ type: mongoose.Types.ObjectId, required: true, ref: "projet" }],
  messages:[{type:mongoose.Types.ObjectId,required:true,ref:'message'}]
});

financiereShcema.plugin(uniqueValidator);

module.exports = mongoose.model("financiere", financiereShcema);
