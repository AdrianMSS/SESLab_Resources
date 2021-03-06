var mongo = require('mongodb'),
    _ = require('underscore'),
    fs = require('fs'),
    lecheriaApp = require('./lecheriaDB');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('SESLab', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log('Connected to "SESLab" database');
        var db2 = db.db('Lecheria');
        lecheriaApp.setDB(db2);
    }
    else{
        console.log(404, 'Error Connecting to "SESLab" database');
    }
});

/*Lecheria Services*/

exports.getLifetime = function(req, res) {
    lecheriaApp.getLifetime(req,res);
};

exports.getMonths = function(req, res) {
    lecheriaApp.getMonths(req,res);
};



exports.monthScript = function(req, res) {
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{months:1, years:1}},function(err, doc_ids) {
        if(err) throw err;
        var monthId = doc_ids.months,
            yearId = doc_ids.years,
            month = new Date().getMonth()+1,
            year = new Date().getFullYear();
        db.collection('Anos').findOne({year:year}, function(err, doc_years){
            if(err) throw err;
            if(!doc_years){
                db.collection('Anos').insert({_id:yearId, year:year}, function(error, result){
                    if(error)throw error;
                })
            }
        });
        db.collection('Meses').findOne({month:month, year:year}, function(err, doc_months){
            if(err) throw err;
            if(!doc_months){
                db.collection('Meses').insert({_id:monthId, year:year, month:month}, function(error, result){
                    if(error)throw error;
                })
            }
        });
    });
};

exports.getResources = function(req, res) {
    db.collection('Recursos').find().toArray(function(err, doc_res) {

        if(err) throw err;

        if (!doc_res) {
            console.log("No document found");
            
        }           
        else {
            res.send(200, doc_res);
        }
    });
};



exports.getDevices = function(req, res) {
    db.collection('Dispositivos').find().toArray(function(err, doc_res) {

        if(err) throw err;

        if (!doc_res) {
            console.log("No document found");
            
        }           
        else {
            res.send(200, doc_res);
        }
    });
};

exports.getMetrics = function(req, res) {
    db.collection('Metricas').find().toArray(function(err, doc_res) {
        if(err) throw err;
        if (!doc_res) console.log("No document found");      
        res.send(200, doc_res);
    });
};

exports.getCarmetrics = function(req, res) {
    db.collection('MetricasAutomoviles').find().toArray(function(err, doc_res) {
        if(err) throw err;
        if (!doc_res) console.log("No document found");      
        res.send(200, doc_res);
    });
};


exports.addType = function(req, res) {
    var resource = req.body;
    db.collection('Ids').findOne({},function(err, doc_ids) {
        var newId = (parseInt(Object.keys(doc_ids.resources)[Object.keys(doc_ids.resources).length-1]) +1).toString();
        if(isNaN(parseInt(newId))){
            newId = '1';
        }
        doc_ids.resources[newId] = {};
        db.collection('Ids').update({_id:1}, doc_ids, {upsert: true, new: true},function(err, doc) {
            resource['families'] = [];
            resource['_id'] = parseInt(newId);
            db.collection('Recursos').insert(resource, function(err, doc_project){
                if(err) throw err;
                res.send(200, resource);
            })
        });
    });
};


exports.addFamily = function(req, res) {
    var familie = req.body,
        type = req.body.type;
    db.collection('Ids').findOne({},function(err, doc_ids) {
        var newId = (parseInt(Object.keys(doc_ids.resources[type])[Object.keys(doc_ids.resources[type]).length-1])+1).toString();
        if(isNaN(parseInt(newId))){
            newId = '1';
        }
        doc_ids.resources[type][newId] = {};
        db.collection('Ids').update({_id:1}, doc_ids, {upsert: true, new: true},function(err, doc) {
            db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
                familie['models'] = [];
                familie['ID'] = type+'.'+newId;
                resource.families.push(familie);
                db.collection('Recursos').update({_id:parseInt(type)},resource,{upsert: true, new: true}, function(err, doc_resource){
                    if(err) throw err;
                    res.send(200, resource);
                });
            });
        });
    });
};

exports.addModel = function(req, res) {
    var model = req.body,
        info = req.body.family,
        type = info.split('.')[0],
        family = info.split('.')[1];
    db.collection('Ids').findOne({},function(err, doc_ids) {
        var newId = (parseInt(Object.keys(doc_ids.resources[type][family])[Object.keys(doc_ids.resources[type][family]).length-1])+1).toString();
        if(isNaN(parseInt(newId))){
            newId = '1';
        }
        doc_ids.resources[type][family][newId] = 0;
        db.collection('Ids').update({_id:1}, doc_ids, {upsert: true, new: true},function(err, doc) {
            db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
                model['ID'] = type+'.'+family+'.'+newId;
                model['quantity'] = 0;           
                var obj = _.find(resource.families, function(obj) { return obj.ID == info }),
                familyIndex = resource.families.indexOf(obj);      
                resource.families[familyIndex].models.push(model);
                db.collection('Recursos').update({_id:parseInt(type)},resource,{upsert: true, new: true}, function(err, doc_resource){
                    if(err) throw err;
                    res.send(200, resource);
                });
            });
        });
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

exports.addMetrics = function(req, res) {
    var resource = req.body;
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{metrics:1}},function(err, doc_ids) {
        if(err) throw err;
        var newId = doc_ids.devices;
        resource['_id'] = newId;
        nowDate = new Date(),
        nowYear = nowDate.getFullYear(),
        nowMonth = nowDate.getMonth()+1,
        nowDay = nowDate.getDate(),
        nowHour = nowDate.getHours(),
        nowMinutes = nowDate.getMinutes(),
        nowSeconds = nowDate.getSeconds();
        resource['_id'] = parseInt(newId);
        resource['year'] = parseInt(nowYear);
        resource['month'] = parseInt(nowMonth);
        db.collection('Metricas').insert(resource, function(err, doc_project){
            if(err) throw err;
            res.send(200, resource);
        });
    });
};

exports.addCarmetrics = function(req, res) {
    var resource = req.body;
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{carmetrics:1}},function(err, doc_ids) {
        if(err) throw err;
        var newId = doc_ids.carmetrics;
        month = resource.date.split('/')[1];
        year = resource.date.split('/')[2];
        resource['_id'] = parseInt(newId);
        resource['year'] = parseInt(year);
        resource['month'] = parseInt(month);
        resource.liters = parseFloat(resource.liters);
        resource.km = parseFloat(resource.km);
        resource.amount = parseFloat(resource.amount);
        db.collection('MetricasAutomoviles').insert(resource, function(err, doc_project){
            if(err) throw err;
            res.send(200, resource);
        });
    });
};



exports.addMetricsVariable = function(req, res) {
    var resource = req.body,
        nowDate = new Date(),
        nowYear = nowDate.getFullYear(),
        nowMonth = nowDate.getMonth()+1,
        nowDay = nowDate.getDate(),
        nowHour = nowDate.getHours(),
        nowMinutes = nowDate.getMinutes(),
        nowSeconds = nowDate.getSeconds();
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{metrics:1}},function(err, doc_ids) {
        if(err) throw err;
        var newId = doc_ids.metrics;
        resource['_id'] = parseInt(newId);
        resource['year'] = parseInt(nowYear);
        resource['month'] = parseInt(nowMonth);
        db.collection('Metricas').insert(resource, function(err, doc_project){
            if(err) throw err;
            res.send(200, resource);
        });
    });
};

exports.updateType = function(req, res) {
    var newType = req.body,
        type = req.body._id;
    db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
        newType['families'] = resource.families;
        newType._id = parseInt(type);
        db.collection('Recursos').update({_id:parseInt(type)},newType,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, newType);
        });
    });
};

exports.updateFamily = function(req, res) {
    var newFamily = req.body,
        family = req.body.ID,
        type = family.split('.')[0];
    db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
        var fam = _.find(resource.families, function(obj) { return obj.ID == family }),
            numFam = resource.families.indexOf(fam);
        newFamily['models'] = resource.families[numFam].models;
        resource.families.splice(numFam, 1);
        resource.families.push(newFamily);
        db.collection('Recursos').update({_id:parseInt(type)},resource,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, resource);
        });
    });
};

exports.updateModel = function(req, res) {
    var newModel = req.body,
        family = req.body.family,
        model = req.body.ID,
        type = family.split('.')[0];
    db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
        var fam = _.find(resource.families, function(obj) { return obj.ID == family }),
            mod = _.find(fam.models, function(obj) {return obj.ID == model}),
            numFam = resource.families.indexOf(fam),
            numMod = resource.families[numFam].models.indexOf(mod); 
        resource.families[numFam].models.splice(numMod, 1);
        resource.families[numFam].models.push(newModel);
        db.collection('Recursos').update({_id:parseInt(type)},resource,{upsert: true, new: true}, function(err, doc_resource){
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

exports.updateMetrics = function(req, res) {
    var newMetric = req.body,
        metric = req.body._id;
    db.collection('Metricas').findOne({_id:parseInt(metric)},function(err, resource) {
        newMetric['year'] = resource.year;
        newMetric['month'] = resource.month;
        newMetric['_id'] = parseInt(metric);
        db.collection('Metricas').update({_id:parseInt(metric)},newMetric,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, newMetric);
        });
    });
};

exports.updateCarmetrics = function(req, res) {
    var newMetric = req.body,
        metric = req.body._id;
        console.log(newMetric);
    db.collection('MetricasAutomoviles').findOne({_id:parseInt(metric)},function(err, resource) {
        month = newMetric.date.split('/')[1];
        year = newMetric.date.split('/')[2];
        newMetric['year'] = parseInt(year);
        newMetric['month'] = parseInt(month);
        newMetric['_id'] = parseInt(metric);
        newMetric.liters = parseFloat(newMetric.liters);
        newMetric.km = parseFloat(newMetric.km);
        newMetric.amount = parseFloat(newMetric.amount);
        db.collection('MetricasAutomoviles').update({_id:parseInt(metric)},newMetric,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, newMetric);
        });
    });
};

exports.deleteType = function(req, res) {
    var type = req.body._id;
    db.collection('Recursos').findAndRemove({_id:parseInt(type)},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
};

exports.deleteFamily = function(req, res) {
    var family = req.body.ID,
        type = family.split('.')[0];
    db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
        var fam = _.find(resource.families, function(obj) { return obj.ID == family }),
            numFam = resource.families.indexOf(fam); 
        resource.families.splice(numFam, 1);
        db.collection('Recursos').update({_id:parseInt(type)},resource,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, resource);
        });
    });
};

exports.deleteModel = function(req, res) {
    var model = req.body.ID,
        family = model.split('.')[0]+'.'+model.split('.')[1],
        type = model.split('.')[0];
    db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
        var fam = _.find(resource.families, function(obj) { return obj.ID == family }),
            mod = _.find(fam.models, function(obj) {return obj.ID == model}),
            numFam = resource.families.indexOf(fam),
            numMod = resource.families[numFam].models.indexOf(mod); 
        resource.families[numFam].models.splice(numMod, 1);
        db.collection('Recursos').update({_id:parseInt(type)},resource,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, resource);
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

exports.deleteMetrics = function(req, res) {
    var metric = req.body._id;
    db.collection('Metricas').findAndRemove({_id:parseInt(metric)},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
};

exports.deleteCarmetrics = function(req, res) {
    var metric = req.body._id;
    db.collection('MetricasAutomoviles').findAndRemove({_id:parseInt(metric)},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
};

exports.dropScript = function(req, res) {
    db.collection('Ids').drop(function(err, reply) {
        if(err) throw err;
        else {
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