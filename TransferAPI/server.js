'use strict';

var express = require('express');
var app = express();
var routes = require('./src/router/index.js');
var cors = require('cors');
require('dotenv').config()

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/src/controllers'));
app.use(cors());

routes(app);

app.listen(3500, function () {
  console.log('Node.js listening on port 3500...');
});
