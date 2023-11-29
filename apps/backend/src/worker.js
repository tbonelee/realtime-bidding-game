const path = require("path");

// require("ts-node").register();
const workerPath = path.resolve(__dirname, "./server-worker.ts");
console.log("workerPath: ", workerPath);
require(workerPath);
