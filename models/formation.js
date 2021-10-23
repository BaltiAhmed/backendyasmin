const mongoose = require("mongoose");
const schema = mongoose.Schema;

const formationSchema = new schema({
  titre: { type: String, required: true },
  dateI: { type: String, required: true },
  image: { type: String, required: true },
  sujet: { type: String, required: true },
  dateD: { type: String, required: true },
  description: { type: String, required: true },
  condidat:[{type:mongoose.Types.ObjectId,required:true,ref:'utilisateur'}],
  participants:[{type:mongoose.Types.ObjectId,required:true,ref:'utilisateur'}],
});

module.exports = mongoose.model("formation", formationSchema);