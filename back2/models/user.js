const mongoose=require("mongoose")
const Schema = mongoose.Schema;


const userSchema=mongoose.Schema({
    
    nom:{type:String,require:true},
    prenom:{type:String,require:true},
    telephone:{type:String,require:true},
    login:{type:String,require:true,unique:true},
    password:{type:String},

    role : { type : String , enum : ['admin' , 'author'] , default : 'author'},
     statut:{ type : String , enum : ['EA' , 'V'] , default : 'EA'},
     publication: [{ type:Schema.Types.ObjectId, ref: 'publication' }],

})
module.exports=mongoose.model("user",userSchema)