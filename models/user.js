const mongoose=require('mongoose');
const LPM=require('passport-local-mongoose');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
userSchema.plugin(LPM);
module.exports=mongoose.model('User',userSchema);