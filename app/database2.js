let express = require("express");
let { Pool } = require("pg");
let env = require("E:/starter2/dbenv.json");
const argon2 = require('argon2');

let hostname = "localhost";
let port = 3000;
let app = express();

app.use(express.json());

let pool = new Pool(env);
pool.connect().then(() => {
    console.log("Connected to database");
});

app.post('/login', async (req, res) => {
    let { username, password } = {username:'user11', password:'12345'};
    /*
    let body = req.body;
    let { username, password } = body;  used when data is sent from frontend
    */
  
    try {
      let queryResult = await pool.query('SELECT * FROM userdata WHERE username = $1', [username]);
      let user = queryResult.rows[0];
      

      const hashpassword = await argon2.hash(password);
      console.log(hashpassword);
      if (!user) {
        await pool.query('INSERT INTO userdata (username, password, loggedin) VALUES ($1, $2, $3)', [
          username,
          hashpassword,
          true, 
        ]);
  
        res.sendStatus(200);
      } else {
        let passwordMatch = await argon2.verify(user.password,password);
  
        if (passwordMatch) {
          console.log(`user ${username} login successfully!`)
          res.sendStatus(200); 
        } else {
          console.log(`Password is wrong!`)
          res.sendStatus(400); 
        }
      }
    } catch (err) {
      console.error('Error processing login/account creation:', err);
      res.sendStatus(500); 
    }
  });

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
