/**
* @description Module and archives used by the server
* @author Adrián Sánchez <asanchez@technergycr.com>
*/

//Dependencies
var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    cronJob = require('cron').CronJob,
    dbapp = require('./resourcesDB'),
    dbusers = require('./usersDB');


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
app.use('/graphs', express.static(__dirname + '/graphs'));
app.use('/energyresources', express.static(__dirname + '/app'));



//Lechería Services
app.get('/graphs/lifetime', dbapp.getLifetime);
app.get('/graphs/months', dbapp.getMonths);


//REST SERVICES

//app.post('/energyresources/login',  dbusers.loginUser);
//app.delete('/energyresources/login',  dbusers.logoutUser);

app.get('/energyresources/admins',  dbusers.getAdmins);
app.post('/energyresources/admins',  dbusers.addAdmins);
app.put('/energyresources/admins',  dbusers.updateAdmins);
app.delete('/energyresources/admins',  dbusers.deleteAdmins);

app.get('/energyresources/users',  dbusers.getUsers);
app.get('/energyresources/drivers',  dbusers.getDrivers);

app.post('/energyresources/users',  dbusers.addUsers);
app.put('/energyresources/users',  dbusers.updateUsers);
app.delete('/energyresources/users',  dbusers.deleteUsers);

app.get('/energyresources/resources',  dbapp.getResources);

app.post('/energyresources/families',  dbapp.addFamily);
app.put('/energyresources/families',  dbapp.updateFamily);
app.delete('/energyresources/families',  dbapp.deleteFamily);

app.post('/energyresources/types',  dbapp.addType);
app.put('/energyresources/types',  dbapp.updateType);
app.delete('/energyresources/types',  dbapp.deleteType);

app.post('/energyresources/models',  dbapp.addModel);
app.put('/energyresources/models',  dbapp.updateModel);
app.delete('/energyresources/models',  dbapp.deleteModel);

app.get('/energyresources/devices',  dbapp.getDevices);
app.post('/energyresources/devices',  dbapp.addDevices);
app.put('/energyresources/devices',  dbapp.updateDevices);
app.delete('/energyresources/devices',  dbapp.deleteDevices);

app.get('/energyresources/metrics',  dbapp.getMetrics);
app.post('/energyresources/metrics',  dbapp.addMetrics);
app.put('/energyresources/metrics',  dbapp.updateMetrics);
app.delete('/energyresources/metrics',  dbapp.deleteMetrics);

app.get('/energyresources/carmetrics',  dbapp.getCarmetrics);
app.post('/energyresources/carmetrics',  dbapp.addCarmetrics);
app.put('/energyresources/carmetrics',  dbapp.updateCarmetrics);
app.delete('/energyresources/carmetrics',  dbapp.deleteCarmetrics);

app.post('/metricsx',  dbapp.addMetricsVariable);

app.post('/imageNew', dbapp.uploadImage);
//Redirect the user to the home page if the url is wrong
app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

// Listening port
var port = Number(process.env.PORT || 9000);
app.listen(port);
console.log('Listening on port ' + port + '...');
