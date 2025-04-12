// const logger = (req, res, next) => {
//     const timestamp = new Date().toISOString();
//     console.log(`[${timestamp}] ${req.method} ${req.url}`);

//     if (Object.keys(req.body).length) {
//         console.log("Request Body:", req.body);
//     }

//     next();
// };
const morgan = require("morgan");

const logger = morgan("dev");

module.exports = logger;
