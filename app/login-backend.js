let express = require("express");
let argon2 = require("argon2");

let hostname = "localhost";
let port = 3000;

let app = express();
app.use(express.json());

let users = {}; //temporary until postgres db done

app.post("/login", async (req, res) => {
    let { body } = req;
    let { username, password } = body;

    let hash;
    try {
        hash = await argon2.hash(password);
    } catch (error) {
        console.log("HASH FAILED", error);
        return res.status(500).send();
    }
    
    if (users.hasOwnProperty(username)) {
        let verifyResult;
        try {
            verifyResult = await argon2.verify(users[username], password);
        } catch (error) {
            console.log("VERIFY FAILED", error);
            return res.status(500).send();
        }
        if (verifyResult) {
            console.log("Login successful!")
            return res.status(200).send();
        } else {
            console.log("Incorrect password")
            return res.status(400).send();
        }
    } else {
        users[username] = hash;
        console.log("Account created");
        return res.status(200).send();
    }
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});