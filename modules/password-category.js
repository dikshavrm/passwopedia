var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lakee:LUcky@@123@cluster0.4k5jm.mongodb.net/passwopedia?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex:true});
// mongoose.connect('mongodb+srv://admin:admin123@cluster0.no9z8.mongodb.net/password-management-system?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex:true});
var conn = mongoose.connection;
var passwordCategorySchema=new mongoose.Schema({
    password_category:{
        type:String,
        required:true,
        index:{
            unique:true,
        }},
        date:{
            type:Date,
            default:Date.now
            },
});

var passCateModel=mongoose.model('password_categories',passwordCategorySchema);

module.exports=passCateModel;