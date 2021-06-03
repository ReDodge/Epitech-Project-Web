const express = require("express");
const mysqlConnection = require('../connexion')
const dataroute = express.Router();


dataroute.get("/", (req, res) => {
    const sql = "SELECT * FROM advertisements JOIN compagnies ON compa_id = comp_id ORDER BY advert_id";
    mysqlConnection.query(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("data", { model: rows });
      
    });
});


  module.exports = dataroute;