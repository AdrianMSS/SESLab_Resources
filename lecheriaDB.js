var db;

exports.setDB = function(db2) {
    db = db2;
    console.log('Connected to "Lecheria" database');
};

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
