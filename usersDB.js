var mongo = require('mongodb'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var key = 'S3sL@b';
 
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


exports.getAdmins = function(req, res) {
    db.collection('Admins').find().toArray(function(err, doc_res) {
        if(err) throw err;
        if (!doc_res) console.log("No document found");
        else {
            doc_res.forEach(function(doc){
                doc.pass = '#########';
            });
            res.send(200, doc_res);
        }
    });
};

exports.getUsers = function(req, res) {
    db.collection('Users').find().toArray(function(err, doc_res) {
        if(err) throw err;
        if (!doc_res) console.log("No document found");
        res.send(200, doc_res);
    });
};

exports.getDrivers = function(req, res) {
    db.collection('Users').find({type:2}).toArray(function(err, doc_res) {
        if(err) throw err;
        if (!doc_res) console.log("No document found");
        res.send(200, doc_res);
    });
};

exports.addAdmins = function(req, res) {
    var cipher = crypto.createCipher('aes-256-cbc', key);
    cipher.update(req.body.pass, 'utf8', 'base64');
    var pass = cipher.final('base64');  
    var resource = req.body;
    resource.pass = pass;
    db.collection('Admins').insert(resource, function(err, doc_project){
        if(err) throw err;
        res.send(200, resource);
    });
};

exports.addUsers = function(req, res) {
    var resource = req.body;
    db.collection('Users').insert(resource, function(err, doc_project){
        if(err) throw err;
        res.send(200, resource);
    });
};

exports.updateAdmins = function(req, res) {
    var admin = req.body._id,
        newId = req.body.ID;
    db.collection('Admins').findOne({_id:admin},function(err, resource) {
        resource.mail = req.body.mail;
        resource.active = req.body.active;
        if(newId === resource._id){
            db.collection('Admins').update({_id:admin},resource,{upsert: true, new: true}, function(err, doc_resource){
                if(err) throw err;
                res.send(200, resource);
            });
        }
        else{
            db.collection('Admins').findAndRemove({_id:admin},function(err, result) {
                if(err) throw err;
                resource._id = newId;
                db.collection('Admins').insert(resource, function(err, doc_project){
                    if(err) throw err;
                    res.send(200, resource);
                });  
            });
        }
        
    });
};

exports.updateUsers = function(req, res) {
    var user = req.body._id,
        newId = req.body.ID;
    db.collection('Users').findOne({_id:user},function(err, resource) {
        if(newId === resource._id){
            db.collection('Users').update({_id:user},resource,{upsert: true, new: true}, function(err, doc_resource){
                if(err) throw err;
                res.send(200, resource);
            });
        }
        else{
            db.collection('Users').findAndRemove({_id:user},function(err, result) {
                if(err) throw err;
                resource._id = newId;
                db.collection('Users').insert(resource, function(err, doc_project){
                    if(err) throw err;
                    res.send(200, resource);
                });  
            });
        }
        
    });
};

exports.deleteAdmins = function(req, res) {
    var admin = req.body._id;
    db.collection('Admins').findAndRemove({_id:admin},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
};

exports.deleteUsers = function(req, res) {
    var user = req.body._id;
    db.collection('Users').findAndRemove({_id:user},function(err, result) {
        if(err) throw err;
        res.send(200, result);   
    });
};




var generator = require('xoauth2').createXOAuth2Generator({
    user: 'adriansanchez.logn',
    clientId: '980433155755-adpdvti4k47c8elkor63181u34e71u0m.apps.googleusercontent.com',
    clientSecret: 'Wrx6qdcv2l4AqRj0X7eJUqRf',
    refreshToken: '1/kfGGuqSGP7q2TEKkPBHXHkN8H3Km9AjTF9Nqg-OiYUc',
    accessToken: 'ya29.swHEs_vuQz2ZWDxkVJI1gpTMOKiFTVquopDydk_SVLoUcUGeBFxpNGAgfeVhRPstOtmj' // optional
});

generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

var transporter = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
}));

/*exports.getPass = function(req, res) {
  client.query('SELECT * FROM users_table WHERE email = $1', [req.body.email], function(err, result) {
    if (err)
     { console.error(err); res.send("Error " + err); }
    else{
      if(result.rows[0]===undefined){
        res.send(401,'Error: Email Inválido');
      }
      else{
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        decipher.update(result.rows[0].pass, 'base64', 'utf8');
        var pass = decipher.final('utf8');
        var fecha = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          mailOptions = {
          to: req.body.email, // receiver
           subject: 'CotoConstructora: Reenvío de Contraseña - Fecha: ' + fecha, // subject
           text: 'Buenos días, se nos ha solicitado un reenvío de contraseña desde la aplicación. \nLa contraseña es ' + pass + '.'
           };
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            console.log(error);
            res.send(400);
          }else{
            console.log('Message sent: ' + info.res);
            res.send(200);
          }
        });   
      }
    }
  });
};*/