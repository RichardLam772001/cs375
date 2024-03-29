const { getPool } = require('../../database/pool.js');
const { KNOWN_USER_COOKIE_DURATION_MS } = require("../../constants.js");

const argon2 = require('argon2');
const crypto = require("crypto");

const tokenStorage = {};
const cookieOptions = {
  httpOnly: false, 
  secure: false, 
  sameSite: "strict",
  maxAge: KNOWN_USER_COOKIE_DURATION_MS 
};


const login = async (req, res) => {
    
    let body = req.body;
    console.log("POST /login/login");
    let { username, password } = body;

    const pool = getPool();

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
          console.log("Generated token");
          tokenStorage[token]=username;
          return res
            .cookie("token", token, cookieOptions)
            .cookie("username", username, cookieOptions)
            .send({"message" : "Success! Generated token."});
          
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
};

const createAccount = async (req, res) => {
    
    let body = req.body;
    let { username, password } = body;  
    
    console.log("POST /login/create", body);
    const pool = getPool();

    try {
      const queryResult = await pool.query('SELECT * FROM userdata WHERE username = $1', [username]);
      const user = queryResult.rows[0];

      if (!user) {
        const hashpassword = await argon2.hash(password);
        await pool.query('INSERT INTO userdata (username, password) VALUES ($1, $2)', [
          username,
          hashpassword,
        ]);
  
        res.sendStatus(200);
      } else {
        console.log("Username already taken. Please pick a different username or log in.");
        return res.status(400).json({ error: "Username already taken. Please pick a different username or log in." });
      }
    } catch (err) {
      console.error('Error processing login/account creation:', err);
      res.sendStatus(500); 
    }
};

module.exports = { createAccount, login, tokenStorage };
