const express = require("express")
const app = express()

//Imported connection module from config.js
const conn = require("./config.js")

//Importing modules from validation.js
const {validateEmail, validateName, validatePassword, validatePhone,} 
       = require("./validation.js");

port = process.env.PORT || 3000;
host = "localhost"

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//=====Database connection===========
conn.connect((err)=>{
    if(err) throw err
    console.log("Database Connected Successfully")
})

app.get('/api/user',(req,res)=>{
    res.send('Welcome to Database Integration')
})

//========================For Login========================
app.post('/api/user/login',[validateEmail,validatePassword],(req,res)=>{
    var loginDetails = req.body
    var flag = false
 try{
    conn.query("select * from Users",(err,result)=>{
        if(err) throw err;
        result.forEach((row)=>{
            if(row.email === loginDetails.email && 
               row.password == loginDetails.password)
            {
                res.send("User Login Successfully");
                flag = true;
                return
            }
        })//end of foreach loop

        if(!flag){
            res.status(404);
            res.send("User Not Found")
        }
    })//end of query

  }catch(error){
    res.status(400);
    res.send("Something went wrong...");
  }
})//end of login

//====================For Signup=======================================
app.post("/api/user/signup",
    [validateName, validatePhone, validateEmail, validatePassword],
    (req,res)=>{
    const reg = req.body;
    var flag = false;
  try{
    conn.query("select * from Users",(err,result)=>{
        if(err) throw err;
        result.forEach((row)=>{
            if(row.email === reg.email && 
               row.password == reg.password)
            {
                res.send("User has already Registered");
                flag = true;
                return 
            }
        })//end of foreach loop
        if(!flag){
            conn.query("Insert into Users values(?,?,?,?,?)",
            [reg.id,reg.name,reg.email,reg.password,reg.phone],(err,row)=>{
                if(err) throw err;

                res.send("Record inserted Successfully");
            })
        }//end of insert query

    })//end of select query

   }catch(error){
        res.status(400);
     res.send("Something went wrong...");
    }
})//end of signup

//===============For Update================================

app.patch("/api/user/:id",
          [validateName, validatePhone, validateEmail, validatePassword],
          (req,res)=>{
    var data = req.body
    var api_id = req.params.id;
  try{
    conn.query("update Users set id = ? ,name = ?,password=?,phone=? where id = ?",
    [data.id,data.name,data.password,data.phone,api_id],(err,result)=>{
        if(err){
            res.send("Error while updating data")
            return
        }
        res.send("User Updated Successfully")
    })//end of update query
  
   }catch(error){
    res.status(400);
    res.send("Something went wrong...");
   }

})//end of update

//==================For Delete ====================

app.delete("/api/user/:id",(req,res)=>{
    var api_id = req.params.id;
    var flag = false;
  try{
    conn.query("select * from Users",(err,result)=>{
        if(err) throw err;
        result.forEach((row)=>{
            if(row.id  == api_id)
            {
                conn.query("delete from Users where id = ?",[api_id],(err,data)=>{
                    if(err) throw err;
                    res.send("User Deleted Successfully");
                })//end of delete query

                flag = true
            }
        })//end of foreach loop

        if(!flag){ 
            res.send("User not found");      
        }
    })//end of select query
 
   }catch(error){
    res.status(400);
    res.send("Something went wrong...");
   }
})//end of delete

//============Server listening============================

app.listen(port,host,()=>{
   console.log(`Server Listening at ${host} with port ${port}`)
})