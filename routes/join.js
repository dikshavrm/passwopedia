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
    var perPage=1;
    var page=req.params.page || 1;
  
    var options = {
     
      offset:   1, 
      limit:   1
  };
  
   
  passModule.aggregate([
    {
      $lookup:{
        from:"password_categories",
        localField:"password_category",
        foreignField:"password_category",
        as:"pass_cat_details"
      }
    }
  ]).exec(function(err,results){
    if(err) throw err;
    console.log(results);
    res.send(results);
  })
  });

  
  
  
  router.get('/:page',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var perPage=1;
    var page=req.params.page || 1;
    getAllPass.skip((perPage*page)-perPage).limit(perPage).exec(function(err,data){
      if(err) throw err;
      passModule.countDocuments({}).exec((err,count)=>{
        res.render('view-all-password', { title: 'Password Management System',
        loginUser:loginUser,
        msg:'',
        records:data ,
        current:page,
        pages:Math.ceil(count/perPage)
      });
  
      })
  
    })
  });



module.exports=router;