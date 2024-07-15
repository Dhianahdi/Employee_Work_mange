const mongoose=require("mongoose")

const PublicationSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    datepub: {
        type: Date,
        default: Date.now
    },
    contenue: {
        type: String,
        required: true
    }
});  
PublicationSchema.virtual('resume').get(function() {
    return this.contenue.slice(10);
  });

module.exports=mongoose.model("publication",PublicationSchema)