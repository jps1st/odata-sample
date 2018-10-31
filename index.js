// Assign the required packages and dependencies to variables
var express = require('express');
var ODataServer = require("./simple-odata-server");
var MongoClient = require('mongodb').MongoClient;
var cors = require("cors");

// Create app variable to initialize Express 
var app = express();

// Enable Cross-origin resource sharing (CORS)  for app.
// app.use(cors());

// Define Odata model of the resource entity i.e. Product.
// The metadata is defined using OData type system called the Entity Data Model (EDM),
// consisting of EntitySets, Entities, ComplexTypes and Scalar Types.
var model = {
    namespace: "demo",
    entityTypes: {
        "Product": {
            "_id": {"type": "Edm.String", key: true},
            "Name": {"type": "Edm.String"}                 
        }
    },   
    entitySets: {
        "products": {
            entityType: "demo.Product"
        }
    }
};

// Instantiates ODataServer and assigns to odataserver variable.
var odataServer = ODataServer().model(model);


var Adapter = require('simple-odata-server-mongodb')
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function(err, db) {
    odataServer.adapter(Adapter(function(cb) {
        cb(err, db.db('demo'));
    }));
});



// The directive to set app route path.
app.use("/odata", function (req, res) {
        odataServer.handle(req, res);
    });

// The app listens on port 3010 and prints the endpoint URI in console window.
var server = app.listen(3010, function () {
    console.log('Server running at http://127.0.0.1:3010/');
});
