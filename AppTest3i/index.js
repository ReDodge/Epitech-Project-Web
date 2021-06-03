const express = require("express");;
const mysqlConnection =require("./connexion");
const app = express();
var bodyParser = require('body-parser');
const comproute = require('./routes/companies');
const advroute = require('./routes/ad');
const dataroute = require('./routes/data');
const clientroute = require('./routes/client');
const peopleroute = require('./routes/people');
var session = require('express-session');
var crypto = require('crypto');
const adminRouter = require("./routes/admin");
var nodemailer = require("nodemailer");
const { getMaxListeners } = require("process");


app.use(
  session({
    secret: "secret",
    name: 'adminid',
    key: 'adminsid',
    resave: true,
    saveUninitialized: true,
  })
);
// Configuration du serveur

app.set("view engine", "ejs");
app.set("views", [__dirname + "/views/pages/partials", __dirname + "/views/pages/people", __dirname + "/views/pages/admin", __dirname + "/views/pages/client", __dirname + "/views/pages/advertisements", __dirname + "/views/pages/people", __dirname + "/views/pages/companies",__dirname + "/views/pages/admin",__dirname + "/views/pages/client"]); 
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/data', dataroute);

app.get('/connectad/*',adminRouter, function (req, res, next) {
  if(req.session.role !== 'admin'){
      res.redirect("/pleaselog");
      return
  }
  app.use('/connectad', adminRouter);
  console.log(req.session.loggedin);
  next();
});
app.use('/connectad/companies', comproute);
app.use('/connectad/advertisements', advroute);
app.use('/connect', clientroute);
app.use('/connectad/people', peopleroute);

app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});


app.get("/about", (req, res) => {
  res.render("_about");
});

app.get("/pleaselog", (req, res) => {
  res.render("pleaselog");
});

app.get("/pleaselogcli", (req, res) => {
  res.render("pleaselogcli");
});

app.get("/connectad", (req, res) => {
  var message = '';
  res.render('connectad',{message: message});
});

app.get("/connect", (req, res) => {
  var messagea = '';
  var messager = '';
  var message = '';
  res.render('connect',{messagea: messagea, messager: messager, message: message});
});

//======================================LEARN MORE==========================================>
app.get("/", (req, res) => {
  const sql = "SELECT advert_id, advert_title, DATE_FORMAT(advert_pdate, '%d-%m-%Y') AS advert_pdate, DATE_FORMAT(advert_startdate, '%d-%m-%Y') AS advert_startdate, advert_presentation, advert_contractcat, advert_pay, comp_id, comp_name, comp_ZIP, comp_city, comp_adresse FROM compagnies JOIN advertisements ON compa_id = comp_id ORDER BY advert_id"; 
  mysqlConnection.query(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("page", { model: rows});
  });
});
//======================================APPLY==========================================>
app.post("/", (req, res) => {
  const sql = "INSERT INTO apply (first_name, name, emailu, phone, ad_id ) VALUES (?, ?, ?, ?, ?)";
  const apply = [req.body.fname, req.body.name, req.body.email, req.body.phone, req.body.id];
  mysqlConnection.query(sql, apply, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/");

  });
});
  
app.post('/appliance', function (req, res) {
  if (!req.session.userId) {
      res.redirect("/pleaselogcli");
      return
  } else {
    res.redirect("/dashboard");
  }
});


app.post("/connect/apply", (req, res) => {
  let senderId = req.body.email,
  textId = req.body.text;
  pubId = req.body.id;
  phoneId = req.body.phone;
  const sql = "INSERT INTO apply (first_name, name, emailu, phone, text, ad_id, user_id ) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const apply = [req.body.fname, req.body.name, req.body.email, req.body.phone, req.body.text, req.body.id, req.body.user_id];
  mysqlConnection.query(sql, apply, err => {
    if (err) {
      return console.error(err.message);
    }
    sendEmail(senderId, pubId, phoneId, textId);
    res.redirect("/connect/offers");

  });
});


app.post('/connectad/authad', function(req, res) {
  var adminname = req.body.adminname;
  var adminpass = crypto.createHash('md5').update(req.body.adminpass).digest("hex");
  console.log("MD5 : " + adminpass);
  

// Verif du mots de passe

if (adminname && adminpass) {
  mysqlConnection.query("SELECT * FROM people WHERE username = ? AND password = ? AND role = 'admin'", [adminname, adminpass], function(error, results, fields) {
      if (results.length > 0) {
  req.session.loggedin = true;
  req.session.adminname = adminname;
  req.session.role = results[0].role;
          res.redirect('/connectad/companies');
      } else {
  message = 'Login or Password Incorrect';
  res.render('connectad',{message: message});
      }
      res.end();
  });
}

});


  
// ==========================================MAIL Problem===========================
function sendEmail(_from, _ad, _phone, _text) {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "279f801b2b49e7",
      pass: "dbfc6b7b781023"
    }
  });

  var mailOptions = {
    from: _from,
    to: 'gabin.neron@epitech.eu',
    subject: "Interested about an Offer",
    html: `<p>Hello, i'm interested about the ad n° :${_ad}</p> <p>Text from the job seeker : ${_text} !</p> <p>Here is my phone number : ${_phone} !</p>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
