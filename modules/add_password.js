var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb+srv://lakee:LUcky@@123@cluster0.4k5jm.mongodb.net/passwopedia?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex:true});
var passwordSchema=new mongoose.Schema({
    password_category:{
        type:String,
        required:true
    },
        password_detail:{
            type:String,
            required:true,
            },
           project_name:{
                type:String,
                required:true,
                },
        date:{
            type:Date,
            default:Date.now
            },
});
passwordSchema.plugin(mongoosePaginate);
var passModel=mongoose.model('password_details',passwordSchema);

module.exports=passModel;