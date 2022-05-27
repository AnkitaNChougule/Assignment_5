const express = require("express")
const app=express()

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

//Importing modules from validation.js
const {validateEmail, validateName, validatePassword, validatePhone,} 
       = require("./validation.js");

const port = process.env.PORT || 3000;
const host = "localhost"

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

  
var addUserData = {
   Users: [],
};

//=================For Login User======================================

app.post("/api/user/login", [validateEmail], (req, res) => {
  var loginDetail = req.body;
  try {
    fs.readFile("users.json", "utf-8", (err, data) => {
      if (err) throw err;
      else {
        
        const readloginData = JSON.parse(data);
        var flag = false;

        for (var key in readloginData.Users) 
        {
          var login = readloginData.Users[key];
          if (login.email === loginDetail.email &&
            login.password === loginDetail.password) 
           {
             res.send("Login Successfully.!!!");
             flag = true;
             break;
           }
        }//end of for loop

        if (!flag) 
         {
          res.status(404);
          res.send("User Not Found For Login\n");
         }
      }
    });//end of readfile

  } catch (error) {
    res.status(400);
    res.send("Something went wrong...");
  }
});//end of login user

//=================For Register User======================================
  app.post(
    "/api/user/signup",
    [validateName, validatePhone, validateEmail, validatePassword],
    (req, res) => {
      const regDetails = req.body;
      try {
        fs.readFile("users.json", "utf-8", (err, data) => {
          if (err) 
          {
            console.log(err);
          } 
          else {
            addUserData = JSON.parse(data);
            addUserData.Users.push(regDetails);
            saveRegData = JSON.stringify(addUserData, null ,2);
  
            fs.writeFile("users.json", saveRegData, "utf-8", function (err) {
              if (err) throw err;
              res.send("Registered Successfully!!!");
            });//end of writefile
          }
        });//end of readfile
      } catch (error) {
        res.status(400);
        res.send("Something went wrong...");
      }
    });//end of register or signup
  
//=================For Update User======================================
  app.patch(
    "/api/user/:email",
    [validateName, validatePhone, validateEmail],
    (req, res) => {
      var api_email = req.params.email;
      try {
        updateDetail = req.body;
        fs.readFile("users.json", "utf-8", (err, data) => {
          if (err) {
            res.send(err);
          } 
          else {
            var flag = false;
            var readUpdate = JSON.parse(data);
            var flag = false;
            for (var key in readUpdate.Users) {
              if (readUpdate.Users[key]["email"] === api_email) 
              {
                readUpdate.Users[key]["name"] = updateDetail["name"];
                readUpdate.Users[key]["phone"] = updateDetail["phone"];
                readUpdate.Users[key]["email"] = updateDetail["email"];

                var saveUpdatedData = JSON.stringify(readUpdate,null,2);
                fs.writeFile("users.json", saveUpdatedData, "utf-8", function (err) {
                  if (err) throw err;
                  res.send("User Updated successfully!!!");
                });//end of writefile
                
                flag = true;
                break;
              }
            }//end of for loop
            if (!flag) 
            {
              res.status(404);
              res.send("User Not Found For Updating Data!");
            }
  
          }
        });//end of readfile
      } catch (error) {
        res.status(400);
        res.send("Something went wrong...!");
      }
    });//end of update
  
//=================For Delete User======================================

  app.delete("/api/user/:email", (req, res) => {
    var api_delete_email = req.params.email;
    try {
      fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
          res.send(err);
        } else {
          var deleteDetail = JSON.parse(data);
          var flag = false;
          for (var key in deleteDetail.Users) 
          {
            if (deleteDetail.Users[key]["email"] === api_delete_email) 
            {
              deleteDetail.Users.splice(key, 1);
              var UpdatedData = JSON.stringify(deleteDetail, null ,2);
  
              fs.writeFile("users.json", UpdatedData, "utf-8", function (err) {
                if (err) throw err;
                res.send("User deleted successfully!!!");
              });//end of writefile

              flag = true;
              break;
            }
          }//end of for loop 
          if (!flag) {
            res.status(404);
            res.send("User Not Found For Delete!");
          }
          
        }
      });//end of readfile
    } catch (error) {
      res.status(400);
      res.send("Something went wrong...!");
    }
    
  });//end of  delete user
  
//=====server Listening=============================
app.listen(port, host  , () =>{
    console.log(`Server Listening with ${port} and ${host}\n` )
 });
