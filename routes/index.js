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
      return res.render('signup',{title:'PMS',msg:'User Already Exists, You can login now'})
    }
    next();
  })
}
// function checkUsername(req,res,next){
//   var email=req.body.email;
//   var checktextEmail=userModule.findOne({username:username});
//   checktextEmail.exec((err,data)=>{
//     if(err) throw err;
//     if(data){
//       return res.render('signup',{title:'PMS',msg:'Username Already Exists, You can login now'})
//     }
//     next();
//   })
// }

/* GET home page. */
router.get('/login', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }
  else{
    res.render('login', { title: 'passoPedia',msg: ''});
  }
});

router.post('/login',function(req,res,next){
  var username=req.body.username;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err,data)=>{
    if(data){
      if(err) throw err;
      var getPassword=data.password;
      var getUserID=data._id;
      if(bcrypt.compareSync(password,getPassword)){
        var token = jwt.sign({ userID: getUserID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        res.redirect('/dashboard');
        // res.render('index',{title:'PMS',msg:'Login Success'});
      }
      else{
        res.render('login',{title:'passoPedia',msg:'Incorrect Username & Password'});
      }
    }else{
      res.render('login',{title:'passoPedia',msg:'Incorrect Username & Password'});
    }

  })
  // res.render('index',{title:'passoPedia',msg:'Incorrect Username & Password'});

});

router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }
  else{
  res.render('signup', { title: 'passoPedia',msg: '' });
  }
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

router.post('/signup',checkEmail, function(req, res, next) {
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  var confirmpassword=req.body.confirmpassword;

  if(password!=confirmpassword){
    res.render('signup', { title: 'passoPedia',msg: 'Password Not Match' });
  }

  else{
    password=bcrypt.hashSync(req.body.password,10);
    var userDetails=new userModule({
     username:username,
     email:email,
     password:password
   });
  }
   userDetails.save((err,data)=>{
     if(err) throw err;
     res.render('signup', { title: 'passoPedia',msg: 'User Register Successfully' });
    })
});

// View Password Category


// End of View Password Category





// Add New Password




router.get('/logout',function(req,res,next){
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
})

router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }
  else{
    res.render('index', { title: 'passoPedia',msg: ''});
  }
});

module.exports = router;




// router.get('/view-all-password',checkLoginUser, function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
//   var perPage=1;
//   var page=req.params.page || 1;

//   var options = {
   
//     offset:   1, 
//     limit:   1
// };
// passModule.paginate({},options).then(function(result){
//       res.render('view-all-password', { title: 'Password Management System',
//       loginUser:loginUser,
//       msg:'',
//       records:result.docs ,
//       current:result.offset,
//       pages:Math.ceil(result.total/result.limit)
//     });

  

//   })
// });



// router.get('/view-all-password/:page',checkLoginUser, function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
//   var perPage=1;
//   var page=req.params.page || 1;
//   getAllPass.skip((perPage*page)-perPage).limit(perPage).exec(function(err,data){
//     if(err) throw err;
//     passModule.countDocuments({}).exec((err,count)=>{
//       res.render('view-all-password', { title: 'Password Management System',
//       loginUser:loginUser,
//       msg:'',
//       records:data ,
//       current:page,
//       pages:Math.ceil(count/perPage)
//     });

//     })

//   })
// });
// // router.get('/view-all-password/edit/:id',checkLoginUser, function(req, res, next) {
// //   var loginUser=localStorage.getItem('loginUser');
// //   var id=req.params.id;
// //   var getPassDetail=passModule.findById({_id:id});
// //   getPassDetail.exec(function(err,data){
// //     if(err) throw err;
// //     getPassCat.exec(function(err,data1){
// //       if(err) throw err;

// //       res.render('edit_password_detail', { title: 'Password Management System',loginUser:loginUser,msg:'',record:data,success:'',records:data1 });

// //     })

// //   })
// // });
// router.post('/view-all-password/edit/:id',checkLoginUser, function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
//   var id=req.params.id;
//   var pass_cat=req.body.pass_cat;
//   var project_name=req.body.project_name;
//   var password_detail=req.body.password_detail;
//   passModule.findByIdAndUpdate(id,{password_category:pass_cat,project_name:project_name,password_detail:password_detail}).exec(function(err){
//     if(err) throw err;

//     var getPassDetail=passModule.findById({_id:id});
//   getPassDetail.exec(function(err,data){
//     if(err) throw err;
//     getPassCat.exec(function(err,data1){
//       if(err) throw err;

//       res.render('edit_password_detail', { title: 'Password Management System',loginUser:loginUser,msg:'',record:data,success:'',records:data1 });
//     });
//     });

//   });
// });

// router.get('/view-all-password/delete/:id',checkLoginUser, function(req, res, next) {
//   var loginUser=localStorage.getItem('loginUser');
//   var id=req.params.id;
//   // console.log(passCat_id);
//   var passdelete=passModule.findByIdAndDelete(id);
//   passdelete.exec(function(err){
//     if(err) throw err;
//     res.redirect('/view-all-password');
//   })
// });


