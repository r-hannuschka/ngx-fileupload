// call all the required packages
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// default options
app.use(fileUpload({}));

app.post('/upload', function(req, res) {
    res.status(202);
    res.send({
        success: true
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));