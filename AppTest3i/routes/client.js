const express = require("express");
const clientRouter = express.Router();
const mysqlConnection = require('../connexion')
var session = require('express-session');
var crypto = require('crypto');
const { nextTick } = require("process");

clientRouter.use(session({
    secret: 'keyboard cat',
    name: 'userid',
    resave: false,
    saveUninitialized: true,
  }));
  
  // ===============Formulaire d'enregistrement client==========
  // Verif des informations 
  clientRouter.post('/signup', function(req, res){ //call for signup post 
       messagea = '';
       messager = '';
       message = '';
       var name= req.body.username;
       var fname= req.body.firstname;
       var lname= req.body.lastname;
       var email= req.body.email;
       var phone= req.body.phone;
       //Encryption du mdp en md5 comme dans la bdd
       var pass = crypto.createHash('md5').update(req.body.password).digest("hex");
  
    if(name && pass && fname && lname && email && phone){
  
       mysqlConnection.query(" SELECT username, emailu FROM people WHERE username='"+ name +"' OR emailu='"+ email +"' ;", function(err, results, fields) { 
         if (results.length === 0){
            mysqlConnection.query("INSERT INTO people VALUES (0, '" + fname + "','" + lname + "','" + email + "','" + phone + "','" + name + "','" + pass + "', 'user');", function(err, result, fields) {
              if (!err){
                messagea = "Succesfully! Your account has been created. You can now log in.";
                res.render('connect',{messagea: messagea});
              } else {
                messager = 'An error as occured';
                res.render('connect',{messagea: messagea, messager: messager, message: message});
              }
                res.end();
           });
         } else {
          messager = "Username or Email already exist !";
          res.render('connect',{messagea: messagea, messager: messager, message: message});
         }
        });
    } else {
       messagea = "A field is empty";
       res.render('connect',{messagea: messagea, messager: messager, message: message});
    }
  });
  
  
  // ===============Formulaire de connexion client==========
  clientRouter.post('/signin', function(req, res){
    var message = '';
    var messagea = '';
    var messager = '';
    var sess = req.session;
    var user= req.body.user;
    //Encryption du mdp en md5 comme dans la bdd
    var pass = crypto.createHash('md5').update(req.body.password).digest("hex");
  
    if(user && pass){
      
      //Verification si l'email ou l'username est rentré et si le mot de pass correspond.                       
      mysqlConnection.query("SELECT * FROM `people` WHERE username='"+ user +"' AND password = '"+ pass +"' OR emailu='"+ user +"' AND password = '"+ pass +"';", function(err, results){      
        if(results.length){
           req.session.userId = results[0].id;
           req.session.user = results[0];
           req.session.role = results[0].role;
           if (req.session.role === 'user') {
            var userId = req.session.userId;
            var sql="SELECT * FROM people WHERE id='"+userId+"'";
            mysqlConnection.query(sql, function(err, row){  
            res.render('dashboard',{data: row})
          })
           } else if (req.session.role === 'admin') {
            res.render('index')
           }
        } else {
          message = 'Login or Password Incorrect';
          res.render('connect',{messagea: messagea, messager: messager, message: message});
        }
                
     });
  } else {
    message = "A field is empty";
    res.render('connect',{messagea: messagea, messager: messager, message: message});
 }
          
});
  
  // ===============Formulaire de déconnexion client==========
  clientRouter.get('/deco', function(req, res){
    if (req.session.userId) {
      req.session.destroy(function(err) {
        res.redirect("/connect");
       });
      } 
   });
  
  
  
  // ==========Initialisation des pages autorisées pour le client======== Penser à la methode du message.lenght pour changer les footer/header
  clientRouter.get('/dashboard', function(req, res) {
    if (req.session.userId) {
      var userId = req.session.userId;
      var sql="SELECT * FROM people WHERE id='"+userId+"'";
      mysqlConnection.query(sql, function(err, row){  
        res.render('dashboard',{data: row});
      })
    } else {
      res.render("pleaselogcli");
    }
  });

  clientRouter.get('/profile',(req, res) =>{
    if (req.session.userId) {
      var userId = req.session.userId;
      var sql="SELECT * FROM people WHERE id='"+userId+"'";
      mysqlConnection.query(sql, function(err, row){  
        res.render('profile',{data: row});
      })
    } else {
      res.render("pleaselogcli");
    }
  });
  clientRouter.post('/profile',(req, res) =>{
    const id = req.session.userId;
    const sql = "UPDATE people SET fname = ?, sname = ?, emailu = ?, phone = ?, username = ?, password = ?, role = ? WHERE id = ?";
    const apply = [req.body.fname, req.body.sname, req.body.email, req.body.phone, req.body.username, req.body.password, req.body.role, id];
    mysqlConnection.query(sql, apply, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connect/profile");
  
    });
  });


    clientRouter.get('/offers',(req, res) =>{
      if (req.session.userId) {
        var userId = req.session.userId;
        var sql="SELECT * FROM apply JOIN advertisements ON ad_id = advert_id JOIN compagnies ON compa_id = comp_id WHERE user_id='"+userId+"' ORDER BY Date";
        mysqlConnection.query(sql, function(err, row){  
          res.render('offers',{model: row});
        })
      } else {
        res.render("pleaselogcli");
      }
    });

    clientRouter.get('/apply',(req, res) =>{
      if (req.session.userId) {
        var userId = req.session.userId;
        const sql = "(SELECT advert_id, advert_title, DATE_FORMAT(advert_pdate, '%d-%m-%Y') AS advert_pdate, DATE_FORMAT(advert_startdate, '%d-%m-%Y') AS advert_startdate, advert_presentation, advert_contractcat, advert_pay, comp_id, comp_name, comp_ZIP, comp_city, comp_adresse, id, fname, sname, emailu, phone FROM compagnies JOIN advertisements ON compa_id = comp_id JOIN people WHERE id = "+userId+")"
        mysqlConnection.query(sql, function(err, row){  
          res.render('apply',{model: row});
        })
      } else {
        res.render("pleaselogcli");
      }
    });
  module.exports=clientRouter;