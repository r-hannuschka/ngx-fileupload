// call all the required packages
const express = require("express");
const app = express();
const resolve = require("path").resolve;
const dirname = require("path").dirname;
const cors = require('cors');
const letsLog = require("letslog");
const fileUpload = require("express-fileupload");

const logger = new letsLog.Logger({
    baseComment: "",
    loglvl: letsLog.ELoglevel.DEBUG,
    transports: [
        {
            baseComment: "",
            loglvl: letsLog.ELoglevel.DEBUG,
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

function sendResponse(res, file, msg = null) {
    const defaultResponse = {
        file: {
            id: 0,
            type: "any"
        },
        message: msg || `Hoooray File: ${file.name} uploaded to /dev/null`
    };

    res.status(response ? response.state : 200);
    res.send(response ? response.body : defaultResponse);
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors());
app.use(fileUpload());

app.post("/upload", function(req, res) {
    const uploadedFile = req.files.file;
    logger.info(`File uploaded: ${uploadedFile.name}`);

    if(timeout) {
        setTimeout(() => sendResponse(res, uploadedFile), timeout);
    } else {
        sendResponse(res, uploadedFile);
    }
});

app.post("/upload/gallery", function(req, res) {

    const uploadedFile = req.files.picture;
    const metadata     = JSON.stringify(req.body);

    logger.debug(`Picture uploaded: ${uploadedFile.name}`);
    logger.debug(`Metadata send: ${metadata}`)

    const message = `New picture added to our gallery ${uploadedFile.name}`;

    if(timeout) {
        setTimeout(() => sendResponse(res, uploadedFile, message), timeout);
    } else {
        sendResponse(res, uploadedFile, message);
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
