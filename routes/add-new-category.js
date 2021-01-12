var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passCatModule=require('../modules/password-category');
var passModule=require('../modules/add_password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var getPassCat=passCatModule.find({});
var getAllPass=passModule.find({});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

function checkEmail(req,res,next){
  var email=req.body.email;
  var checktextEmail=userModule.findOne({email:email});
  checktextEmail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup',{title:'PMS',msg:'ALready Exists'})
    }
    next();
  })
}

router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
      res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,msg:'',errors:'',success:''});
    
  });


  router.post('/',checkLoginUser,[check('passwordCategory','Enter password').isLength({min:1})], function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    const errors=validationResult(req);
    console.log(errors.mapped());
    if(!errors.isEmpty()){
    res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,msg:'',errors:errors.mapped(),success:''});
    }
    else{
      var passCat=req.body.passwordCategory;
      var passDetails=new passCatModule({
        password_category:passCat
      });
      passDetails.save(function(err,data){
        if(err) throw err;
        res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,msg:'',errors:'',success:'Category added Successfully'});
  
      })
    }
  });

  module.exports=router;