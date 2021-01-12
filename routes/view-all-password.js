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


// router.get('/',checkLoginUser, function(req, res, next) {
//     var loginUser=localStorage.getItem('loginUser');
//     var perPage=5;
//     var page=req.params.page || 1;
  
//     var options = {
     
//       offset:   1, 
//       limit:   1
//   };
//   passModule.paginate({},options).then(function(result){
//         res.render('view-all-password', { title: 'Password Management System',
//         loginUser:loginUser,
//         msg:'',
//         records:result.docs ,
//         current:result.offset,
//         pages:Math.ceil(result.total/result.limit)
//       });
  
    
  
//     })
//   });

router.get('/',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var perPage=5;
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
  
  
  
  router.get('/:page',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var perPage=5;
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
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var getPassDetail=passModule.findById({_id:id});
    getPassDetail.exec(function(err,data){
      if(err) throw err;
      getPassCat.exec(function(err,data1){
        if(err) throw err;
  
        res.render('edit_password_detail', { title: 'Password Management System',loginUser:loginUser,msg:'',record:data,success:'',records:data1 });
  
      })
  
    })
  });
  router.post('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var pass_cat=req.body.pass_cat;
    var project_name=req.body.project_name;
    var password_detail=req.body.password_detail;
    passModule.findByIdAndUpdate(id,{password_category:pass_cat,project_name:project_name,password_detail:password_detail}).exec(function(err){
      if(err) throw err;
  
      var getPassDetail=passModule.findById({_id:id});
    getPassDetail.exec(function(err,data){
      if(err) throw err;
      getPassCat.exec(function(err,data1){
        if(err) throw err;
  
        res.render('edit_password_detail', { title: 'Password Management System',loginUser:loginUser,msg:'',record:data,success:'',records:data1 });
      });
      });
  
    });
  });
  
  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    // console.log(passCat_id);
    var passdelete=passModule.findByIdAndDelete(id);
    passdelete.exec(function(err){
      if(err) throw err;
      res.redirect('/view-all-password/1');
    })
  });
  
  
  
  


module.exports=router;