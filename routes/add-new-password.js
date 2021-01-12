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
      console.log(data);
      res.render('add-new-password', { title: 'Password Management System',loginUser:loginUser,msg:'', records:data,success:'' });
  
    })
  });
  router.post('/',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var pass_cat=req.body.pass_cat;
    var pass_details=req.body.password_detail;
    var project_name=req.body.project_name;
  
    var password_details=new passModule({
      password_category:pass_cat,
      password_detail:pass_details,
      project_name:project_name
    })
    
      password_details.save(function(err,doc){
        getPassCat.exec(function(err,data){
          // console.log(doc);
          if(err) throw err;
        res.render('add-new-password', { title: 'Password Management System',loginUser:loginUser,msg:'', records:data,success:'Password added Successfully' });
  
      })
  
  
    })
  });
  



module.exports=router;