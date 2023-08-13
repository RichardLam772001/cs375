let express = require("express");
let { Pool } = require("pg");
let env = require("../dbenv.json");
const argon2 = require('argon2');
let cookieParser = require("cookie-parser");
let crypto = require("crypto");


let hostname = "localhost";
let port = 3000;
let app = express();
let tokenStorage={};
app.use(express.static("public"));

app.use(express.json());

let pool = new Pool(env);
pool.connect().then(() => {
    console.log("Connected to database");
});

let cookieOptions = {
  httpOnly: true, 
  secure: true, 
  sameSite: "strict", 
};

app.post('/login', async (req, res) => {
    
    let body = req.body;
    let { username, password } = body;  
    
  
    try {
      let queryResult = await pool.query('SELECT * FROM userdata WHERE username = $1', [username]);
      let user = queryResult.rows[0];
      

      
      if (!user) {
        console.log("User does not exist");
        return res.status(400).json({error:"User does not exist"});
      } else {
        const passwordMatch = await argon2.verify(user['password'],password);
  
        if (passwordMatch) {
          console.log(`user ${username} login successfully!`);
          let token=crypto.randomBytes(32).toString("hex");
          console.log("Generated token", token);
          tokenStorage[token]=username;
          return res
            .cookie("token",token,cookieOptions)
            .send();
          
          //res.sendStatus(200); 
        } else {
          console.log(`Password is wrong!`)
          return res.status(400).json({ error: "Password is wrong, please retry" });
        }
      }
    } catch (err) {
      console.error('Error processing login/account creation:', err);
      res.sendStatus(500); 
    }
  });

app.post('/create', async (req, res) => {
    
    let body = req.body;
    let { username, password } = body;  
    
  
    try {
      let queryResult = await pool.query('SELECT * FROM userdata WHERE username = $1', [username]);
      let user = queryResult.rows[0];
      

      
      if (!user) {
        const hashpassword = await argon2.hash(password);
        await pool.query('INSERT INTO userdata (username, password, loggedin) VALUES ($1, $2, $3)', [
          username,
          hashpassword,
          true, 
        ]);
  
        res.sendStatus(200);
      } else {
        console.log("User already exist, please log in");
        return res.status(400).json({ error: "User already exist, please log in" });
      }
    } catch (err) {
      console.error('Error processing login/account creation:', err);
      res.sendStatus(500); 
    }
  });
/*
app.post("/logout",(req,res) => {
  let token=req.cookies;
  if (token===undefined) {
    console.log("logged out already");
    return res.status(400).send();
  }
  if (!tokenStorage.hasOwnProperty(token)) {
    console.log("Token doesn't exist");
    return res.status(400).send(); 
  }
  console.log("Before",tokenStorage);
  delete tokenStorage[token];
  console.log("Deleted",tokenStorage);
  return res.clearCookie("token",cookieOptions).send();
})
*/
app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
