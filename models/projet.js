const mongoose = require("mongoose")
const schema = mongoose.Schema;

const projetSchema = new schema({

    titre: { type: String, required: true },
    descreption: { type: String, required: true },
    datelancement: { type: String, required: true },
    categorie: { type: String, required: true },
    equipements:[{type:mongoose.Types.ObjectId,required:true,ref:'equipement'}],
    productions:[{type:mongoose.Types.ObjectId,required:true,ref:'production'}],
    marketings:[{type:mongoose.Types.ObjectId,required:true,ref:'marketing'}]

})



module.exports = mongoose.model('projet', projetSchema)
