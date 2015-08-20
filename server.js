var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(express.static('.public'));
app.use(morgan('dev'));

var port = 8080;

var server = app.listen(port);
console.log("Server is listening on", port);