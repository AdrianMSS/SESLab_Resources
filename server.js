/**
* @description Module and archives used by the server
* @author Adrián Sánchez <asanchez@technergycr.com>
*/

//Dependencies
var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    dbapp = require('./database');


//REST framework 
var app = express();
 
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser());
app.use(express.static(__dirname + '/app'));





//REST SERVICES

app.get('/resources',  dbapp.getResources);

app.post('/families',  dbapp.addFamilie);
app.post('/types',  dbapp.addType);

app.get('/models',  dbapp.checkResources);
app.post('/models',  dbapp.addModel);



//Redirect the user to the home page if the url is wrong
app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

// Listening port
var port = Number(process.env.PORT || 9000);
app.listen(port);
console.log('Listening on port ' + port + '...');
