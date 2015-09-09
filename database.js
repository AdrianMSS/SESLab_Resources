var mongo = require('mongodb'),
    _ = require('underscore');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('SESLab', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log('Connected to "SESLab" database');
    }
    else{
        console.log(404, 'Error Connecting to "SESLab" database');
    }
});


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


exports.addFamilie = function(req, res) {
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

exports.checkResources = function(req, res) {
    var resource = req.body,
        info = '1.1',
        type = info.split('.')[0],
        family = info.split('.')[1];
    /*db.collection('Ids').findOne({},function(err, doc_ids) {
        var newId = (parseInt(Object.keys(doc_ids.resources[type][family])[Object.keys(doc_ids.resources[type][family]).length-1])+1).toString();
        if(isNaN(parseInt(newId))){
            newId = '1';
        }
        console.log(newId);
        //doc_ids.resources[newId] = {};
        //db.collection('Ids').update({_id:1}, doc_ids, {upsert: true, new: true},function(err, doc) {
            res.send(200, doc_ids);
        //});
    });*/
    db.collection('Recursos').findOne({_id:parseInt(type)},function(err, resource) {
        //model['ID'] = type+'.'+family+'.'+newId;
        var obj = _.find(resource.families, function(obj) { return obj.ID == info }),
            familyIndex = resource.families.indexOf(obj);   
        console.log(resource.families[familyIndex].models);

        //resource.families[].push(familie);
        /*db.collection('Recursos').update({_id:parseInt(type)},resource,{upsert: true, new: true}, function(err, doc_resource){
            if(err) throw err;
            res.send(200, resource);
        });*/
    });
};