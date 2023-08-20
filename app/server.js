// Require statements
const { setRequestHandlers } = require("./request_handlers/request_handlers.js");
const { HOSTNAME, PORT } = require("../env.json");

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.static("public"));
app.use(cookieParser());

app.use(express.static("public"));
app.use(express.json());

app.listen(PORT, () => {
	console.log(`App running on http://${HOSTNAME}:${PORT}`);
});

setRequestHandlers(app);
