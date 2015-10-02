/**
* @description Module and archives used by the server
* @author Adrián Sánchez <asanchez@technergycr.com>
*/

//Dependencies
var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cronJob = require('cron').CronJob,
    dbapp = require('./database');


/*
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11
Day of Week: 0-6*/
new cronJob('15 0 0 1 * *', function(){
        //console.log("CronJob")
        dbapp.monthScript();
    }, null, true, null);


//dropScript

//REST framework 
var app = express();
 
app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser());
app.use(express.multipart());
app.use(express.static(__dirname + '/app'));





//REST SERVICES

app.get('/resources',  dbapp.getResources);

app.post('/families',  dbapp.addFamily);
app.put('/families',  dbapp.updateFamily);
app.delete('/families',  dbapp.deleteFamily);

app.post('/types',  dbapp.addType);
app.put('/types',  dbapp.updateType);
app.delete('/types',  dbapp.deleteType);

app.post('/models',  dbapp.addModel);
app.put('/models',  dbapp.updateModel);
app.delete('/models',  dbapp.deleteModel);

app.get('/devices',  dbapp.getDevices);
app.post('/devices',  dbapp.addDevices);

app.post('/imageNew', dbapp.uploadImage);
//Redirect the user to the home page if the url is wrong
app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

// Listening port
var port = Number(process.env.PORT || 9000);
app.listen(port);
console.log('Listening on port ' + port + '...');
