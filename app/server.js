// Require statements
const { setRequestHandlers } = require("./request_handlers/request_handlers.js");
const { PROD_HOSTNAME, LOCAL_HOSTNAME, PROD_PORT, LOCAL_PORT, IS_PROD } = require("../env.json");

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.static("public"));
app.use(cookieParser());

app.use(express.static("public"));
app.use(express.json());

const hostname = IS_PROD ? PROD_HOSTNAME : LOCAL_HOSTNAME;
const port = IS_PROD ? PROD_PORT : LOCAL_PORT;

app.listen(port, () => {
	console.log(`App running on http://${hostname}:${port}`);
});

setRequestHandlers(app);
