// Require statements
const { setRequestHandlers } = require("./request_handlers/request_handlers.js");
const { app } = require("./wss.js");

setRequestHandlers(app);
