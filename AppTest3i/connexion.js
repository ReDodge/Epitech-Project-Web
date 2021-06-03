const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'hugab',
    password: 'Prohugab2020',
    database: 'project',
    });

    mysqlConnection.connect((err)=> {
        if(!err)
        console.log('Connection Established Successfully');
        else
        console.log('Connection Failed!');
        });

module.exports = mysqlConnection;