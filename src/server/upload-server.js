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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(fileUpload());

app.post("/upload", function(req, res) {

    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    logger.info(`File uploaded: ${uploadedFile.name}`)

    res.status(201);
    res.send({
        message: "das lief prima"
    });
});

app.listen(3000, () => process.stdout.write("Server started on port 3000\n"));
