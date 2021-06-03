const express = require("express");
const compRouter = express.Router();
const mysqlConnection = require('../connexion')


 // GET UPDATE

compRouter.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM compagnies WHERE comp_id = ?";
    mysqlConnection.query(sql, id, (err, row) => {
        if (err) {
            return console.error(err.message);
          }
      res.render("edit", { model: row });
    });
});

  // POST  /UPDATE
compRouter.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const companies = [req.body.Adresse, req.body.ZIPcode, req.body.Ville, req.body.CompaniesName, id];
    const sql = "UPDATE compagnies SET comp_adresse = ?, comp_ZIP = ?, comp_city = ?, comp_name = ? WHERE comp_id = ?";
    mysqlConnection.query(sql, companies, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/companies");
    });
});


// GET /create
compRouter.get("/create", (req, res) => {
    res.render("create", { model: {} });
});

// POST /create
compRouter.post("/create", (req, res) => {
    const sql = "INSERT INTO compagnies (comp_adresse, comp_ZIP, comp_city, comp_name) VALUES (?, ?, ?, ?)";
    const companies = [req.body.Adresse, req.body.ZIPcode, req.body.Ville, req.body.CompaniesName];
    mysqlConnection.query(sql, companies, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/companies");
    });
});
  
  // GET /delete
  compRouter.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM compagnies WHERE comp_id = ?";
    mysqlConnection.query(sql, id, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("delete", { model: row });
    });
})


  // POST /delete
  compRouter.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM compagnies WHERE comp_id = ?";
    mysqlConnection.query(sql, id, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/companies");
    });
});

module.exports = compRouter;