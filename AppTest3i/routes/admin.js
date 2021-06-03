const express = require("express");
const adminRouter = express.Router();
const mysqlConnection = require('../connexion')
var session = require('express-session');
var crypto = require('crypto');

adminRouter.use(
    session({
      secret: "secret",
      name: 'adminid',
      key: 'adminsid',
      resave: true,
      saveUninitialized: true,
    })
  );


  // ===============Formulaire de connexion admin==========
  
  adminRouter.post('/authad', function(req, res) {
    var adminname = req.body.adminname;
  
   //Encryption du mdp en md5 comme dans la bdd
    var adminpass = crypto.createHash('md5').update(req.body.adminpass).digest("hex");
  
    
  
  // Verif du mots de passe
  
  if (adminname && adminpass) {
    mysqlConnection.query("SELECT * FROM people WHERE username = ? AND password = ? AND role = 'admin'", [adminname, adminpass], function(error, results, fields) {
        if (results.length > 0) {
    req.session.loggedin = true;
    req.session.adminname = adminname;
    req.session.role = results[0].role;
            res.redirect('/connectad/index');
        } else {
    message = 'Login or Password Incorrect';
    res.render('connectad',{message: message});
        }
        res.end();
    });
  }

});
  
  // ===============Formulaire de déconnexion admin==========
  adminRouter.get('/decoad', function(req, res){
    req.session.destroy(function(err) {
       res.redirect("/connectad/index");
    });
   });
  
  
  // ==========Initialisation des pages autorisées pour l'admin========
  adminRouter.get('/index', function(req, res) {
      if (req.session.role === 'admin') {
          res.render("index");
      } else {
      res.render("pleaselog");
      }
      res.end();
  });
  
  
  adminRouter.get("/about", function(req, res) {
      if (req.session.role === 'admin') {
          res.render("about");
      } else {
          res.render("pleaselog");
      }
      res.end();
  });
  
  adminRouter.get("/companies", (req, res) => {
    const sql = "SELECT * FROM compagnies ORDER BY comp_id";
    mysqlConnection.query(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      if (req.session.role === 'admin') {
        res.render("companies", { model: rows });
      } else {
        res.render("pleaselog");
      }
      res.end();
    });
    mysqlConnection.end;
  });

  adminRouter.get("/advertisements", (req, res) => {
    const sql = "SELECT advert_id, advert_title, DATE_FORMAT(advert_pdate, '%Y-%m-%d') AS advert_pdate, DATE_FORMAT(advert_startdate, '%Y-%m-%d') AS advert_startdate, advert_presentation, advert_contractcat, advert_pay, compa_id, comp_name FROM advertisements JOIN compagnies ON compa_id = comp_id ORDER BY advert_id"; 
    mysqlConnection.query(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      if (req.session.role === 'admin') {
        res.render("advertisements", { model: rows });
      } else {
        res.render("pleaselog");
      }
      res.end();
    });
    mysqlConnection.end;
  });

  adminRouter.get("/people", (req, res) => {
    const sql = "SELECT * FROM people ORDER BY id";
    mysqlConnection.query(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      if (req.session.role === 'admin') {
        res.render("people", { model: rows });
      } else {
        res.render("pleaselog");
      }
      res.end();
    });
    mysqlConnection.end;
  });


  module.exports=adminRouter;