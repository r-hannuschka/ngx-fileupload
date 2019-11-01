// call all the required packages
const express = require("express");
const app = express();
const resolve = require("path").resolve;
const dirname = require("path").dirname;
const letsLog = require("letslog");
const fileUpload = require('express-fileupload');
const logger = new letsLog.Logger({
    baseComment: "",
    loglvl: letsLog.ELoglevel.DEBUG,
    transports: [
        {
            baseComment: "",
            loglvl: letsLog.ELoglevel.INFO,
            logpath: resolve(dirname(__filename)),
            logFileName: "upload",
            type: letsLog.ETransportType.filesystem,
            showBaseComment: false,
            showDate: false,
            showLoglevel: false
        }
    ]
});

let response = null;
let timeout = 0;

function sendResponse(res, file) {
    const defaultResponse = {
        file: {
            id: 0,
            type: 'any'
        },
        message: `Hoooray File: ${file.name} uploaded to /dev/null`
    };

    res.status(response ? response.state : 200);
    res.send(response ? response.body : defaultResponse);
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(fileUpload());

app.post("/upload", function(req, res) {

    const uploadedFile = req.files.file;
    logger.info(`File uploaded: ${uploadedFile.name}`)

    if(timeout) {
        setTimeout(() => sendResponse(res, uploadedFile), timeout);
    } else {
        sendResponse(res, uploadedFile);
    }
});

app.listen(3000, () => process.stdout.write("Server started on port 3000\n"));

/**
 * register process messages through ipc
 */
process.on("message", (data) => {
    response = data.response;
    timeout  = data.timeout || 0;
});