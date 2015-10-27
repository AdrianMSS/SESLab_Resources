var mongo = require('mongodb'),
    _ = require('underscore'),
    fs = require('fs');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('Lecheria', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log('Connected to "Lecheria" database');
    }
    else{
        console.log(404, 'Error Connecting to "Lecheria" database');
    }
});

exports.getLifetime = function(req, res) {
    db.collection('daily').findOne({_id:1}, function(err, doc_res) {

        if(err) throw err;

        if (!doc_res) {
            console.log("No document found");
            
        }           
        else {
            res.send(200, doc_res);
        }
    });
};

exports.getMonths = function(req, res) {
    db.collection('monthly').find().toArray(function(err, doc_res) {

        if(err) throw err;

        if (!doc_res) {
            console.log("No document found");
            
        }           
        else {
            res.send(200, doc_res);
        }
    });
};

exports.addDevices = function(req, res) {
    var resource = req.body;
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{devices:1}},function(err, doc_ids) {
        if(err) throw err;
        var newId = doc_ids.devices;
        resource['_id'] = newId;
        db.collection('Dispositivos').insert(resource, function(err, doc_project){
            if(err) throw err;
            res.send(200, resource);
        });
    });
};


exports.updateDevices = function(req, res) {
    var newDevice = req.body,
        device = req.body._id;
    db.collection('Dispositivos').findOne({_id:parseInt(device)},function(err, resource) {
        newDevice._id = parseInt(device);
        db.collection('Dispositivos').update({_id:parseInt(device)},newDevice,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, newDevice);
        });
    });
};

exports.deleteDevices = function(req, res) {
    var device = req.body._id;
    db.collection('Dispositivos').findAndRemove({_id:parseInt(device)},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
};

exports.dropScript = function(req, res) {
    db.collection('Ids').drop(function(err, reply) {
        if(err) throw err;
        else {
            console.log(reply);
            var obj = {_id:1, resources:{}, devices:1, years:2, months:2, metrics:1};
            db.collection('Ids').insert(obj, function(error, doc) {
                if(error) throw error;
                else console.log(obj);
            });
        }      
    });
    db.collection('Anos').drop(function(err, reply) {
        if(err) throw err;
        else {
            console.log(reply);
            var year = new Date().getFullYear();
            var obj = {_id:1, year:year};
            db.collection('Anos').insert(obj, function(error, doc) {
                if(error) throw error;
                else console.log(obj);
            });
        }       
    });
    db.collection('Meses').drop(function(err, reply) {
        if(err) throw err;
        else {
            console.log(reply);
            var month = new Date().getMonth()+1;
            var obj = {_id:1, month:month, year:1};
            db.collection('Meses').insert(obj, function(error, doc) {
                if(error) throw error;
                else console.log(obj);
            });
        }       
    });
    db.collection('Recursos').drop(function(err, reply) {
        if(err) throw err;
        else console.log(reply);  
    });
    db.collection('Dispositivos').drop(function(err, reply) {
        if(err) throw err;
        else console.log(reply);     
    });
    db.collection('Metricas').drop(function(err, reply) {
        if(err) throw err;
        else console.log(reply);     
    });
};

exports.uploadImage = function(req, res) {
    var serverPath = './app/images/' + req.files.userPhoto.name,
        clientPath = './images/' + req.files.userPhoto.name;

    fs.rename(
    req.files.userPhoto.path,
    serverPath,
    function(error) {
        if(error) {
            res.send(400);
                return;
            }
            res.send(200,{path: clientPath});
    }
    );
};