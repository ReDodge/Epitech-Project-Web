const express = require("express");
const advRouter = express.Router();
const mysqlConnection = require('../connexion')



  // GET /UPDATE
  advRouter.get("/ad_edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT advert_id, advert_title, DATE_FORMAT(advert_pdate, '%Y-%m-%d') AS advert_pdate, DATE_FORMAT(advert_startdate, '%Y-%m-%d') AS advert_startdate, advert_presentation, advert_contractcat, advert_pay, compa_id, comp_name FROM advertisements JOIN compagnies ON compa_id = comp_id  WHERE advert_id = ?";
    mysqlConnection.query(sql, id, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("ad_edit", { model: row });
    });
  });
  
  
  // POST  /UPDATE
  advRouter.post("/ad_edit/:id", (req, res) => {
    const id = req.params.id;
    const advert = [req.body.title, new Date(req.body.advert_pdate), new Date(req.body.advert_startdate), req.body.presentation, req.body.contractcat, req.body.pay, req.body.comp_id, id];
    const sql = "UPDATE advertisements SET advert_title = ?, advert_pdate= ?, advert_startdate = ?, advert_presentation = ?, advert_contractcat = ?,advert_pay = ?, compa_id = ?  WHERE advert_id = ?";
    mysqlConnection.query(sql, advert, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/advertisements");
    });
  });
  
  
  // GET /create
  advRouter.get("/ad_create", (req, res) => {
    const sql = "SELECT * FROM compagnies ORDER BY comp_id";
    mysqlConnection.query(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
    res.render("ad_create", { model: rows });
  });
});
  
  // POST /create
  advRouter.post("/ad_create", (req, res) => {
    const sql = "INSERT INTO advertisements (advert_title, advert_pdate, advert_startdate, advert_presentation, advert_contractcat, advert_pay, compa_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const advert = [req.body.title, new Date(req.body.advert_pdate), new Date(req.body.advert_startdate), req.body.presentation, req.body.contractcat, req.body.pay, req.body.comp_id];
    mysqlConnection.query(sql, advert, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/advertisements");

    });
  });
  
  // GET /delete
  advRouter.get("/ad_delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM advertisements WHERE advert_id = ?";
    mysqlConnection.query(sql, id, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("ad_delete", { model: row });
    });
  })
  
  
  // POST /delete
  advRouter.post("/ad_delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM advertisements WHERE advert_id = ?";
    mysqlConnection.query(sql, id, err => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect("/connectad/advertisements");
    });
  });

  module.exports = advRouter;
  