const express = require("express");
const peopleRouter = express.Router();
const mysqlConnection = require('../connexion')
const crypto = require('crypto');


// GET /create
peopleRouter.get("/people_create", (req, res) => {
    res.render("people_create", { model: {} });
});

peopleRouter.post("/people_create", (req, res) => {
  const sql = "INSERT INTO people (fname, sname, emailu, phone, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const password = crypto.createHash('md5').update(req.body.Password).digest("hex");
  console.log("MD5 : " + password);
  const people = [req.body.Prenom, req.body.Nom, req.body.Email,req.body.Phone, req.body.Username, password, req.body.Role];
  mysqlConnection.query(sql, people, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/connectad/people");
  });
});

peopleRouter.get("/people_edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM people WHERE id = ?";
  mysqlConnection.query(sql, id, (err, row) => {
      if (err) {
          return console.error(err.message);
        }
    res.render("people_edit", { model: row });
  });
});

  // POST  /UPDATE
peopleRouter.post("/people_edit/:id", (req, res) => {
    const id = req.params.id;
    const people = [req.body.Prenom, req.body.Nom, req.body.Email, req.body.Phone, req.body.Username, req.body.Password, id];
    const sql = "UPDATE people SET fname = ?, sname = ?, emailu = ?, phone = ?, username = ?, password = ? WHERE id = ?";
    mysqlConnection.query(sql, people, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/people");;
    });
});

  // GET /delete
  peopleRouter.get("/people_delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM people WHERE id = ?";
    mysqlConnection.query(sql, id, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("people_delete", { model: row });
    });
})


  // POST /delete
  peopleRouter.post("/people_delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM people WHERE id = ?";
    mysqlConnection.query(sql, id, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/people");
    });
});
module.exports=peopleRouter;