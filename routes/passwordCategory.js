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
    getPassCat.exec(function(err,data){
      if(err) throw err;
      res.render('password_category', { title: 'Password Management System' ,loginUser:loginUser,msg:'',records:data });
    })
  });

  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCat_id=req.params.id;
    console.log(passCat_id);
    var passdelete=passCatModule.findByIdAndDelete(passCat_id);
    passdelete.exec(function(err){
      if(err) throw err;
      res.redirect('/passwordCategory');
    })
  });
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCat_id=req.params.id;
    console.log(passCat_id);
    var getpassCategory=passCatModule.findById(passCat_id);
    getpassCategory.exec(function(err,data){
      if(err) throw err;
      console.log(data);
      res.render('edit_pass_category', { title: 'Password Management System' ,loginUser:loginUser,msg:'',errors:'',success:'',records:data,id:passCat_id });
    })
  });
  router.post('/edit',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var passCat_id=req.body.id;
    var passwordCategory=req.body.passwordCategory;
  
    console.log(passCat_id);
    var update_passCat=passCatModule.findByIdAndUpdate(passCat_id,{password_category:passwordCategory})
    update_passCat.exec(function(err,doc){
      if(err) throw err;
      // console.log(data);
      res.redirect('/passwordCategory');
    })
  });

  
  module.exports=router;