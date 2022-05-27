//=====Database connection===========

const mysql = require("mysql")

const conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "Anki@13900",
    database : "Employee"
})

module.exports=conn