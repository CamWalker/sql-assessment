var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var config = require('./config.js')
//Need to enter username and password for your database
var connString = "postgres://postgres:" + config.pass + "@localhost:8000/postgres";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init")
    });

    app.get('/api/users', function (req, res, next) {
      db.get_all_users(function (err, users) {
        if (!err) {
          res.status(200).send(users)
        }
      })
    })

    app.get('/api/vehicles', function (req, res, next) {
      db.get_all_vehicles(function (err, vehicles) {
        if (!err) {
          res.status(200).send(vehicles)
        }
      })
    })

    app.post('/api/users', function (req, res, next) {
      db.post_new_user([req.body.firstname, req.body.lastname, req.body.email],function (err) {
        if (!err) {
          res.status(200).send("");
        }
      })
    })

    app.post('/api/vehicles', function (req, res, next) {
      db.post_new_vehicle([req.body.make, req.body.model, Number(req.body.year),Number(req.body.ownerId)], function (err) {
        if (!err) {
          res.status(200).send("")
        }
      })
    })

    app.get('/api/user/:userId/vehiclecount', function (req, res, next) {
      db.get_count_of_vehicles_by_owner([Number(req.params.userId)], function (err, count) {
        if (!err) {
          res.status(200).send({count: count[0].count})
        }
      })
    })

    app.get('/api/user/:userId/vehicle', function (req, res, next) {
      db.get_vehicles_by_user([Number(req.params.userId)], function (err, vehicles) {
        if (!err) {
          res.status(200).send(vehicles)
        }
      })
    })

    app.get('/api/vehicle', function (req, res, next) {
      let firstLetter = "%";
      if (req.query.userFirstStart) {
        firstLetter = req.query.userFirstStart + '%';
      }
      let email = '%'
      if (req.query.UserEmail) {
        email = req.query.UserEmail
      }

      db.get_vehicles_by_email([email, firstLetter], function (err, vehicles) {
        if (!err) {
          res.status(200).send(vehicles)
        }
      })
    })

    app.get('/api/newervehiclesbyyear', function (req, res, next) {
      db.get_newer_vehicles(function (err, vehicles) {
        if (!err) {
          res.status(200).send( vehicles)
        }
      })
    })

    app.put('/api/vehicle/:vehicleId/user/:userId', function (req, res, next) {
      console.log('_------___--_---------', req.params);
      db.put_vehicle_ownership([Number(req.params.vehicleId), Number(req.params.userId)], function (err) {
        if (!err) {
          res.status(200).send("");
        }
      })
    })

    app.delete('/api/user/:userId/vehicle/:vehicleId', function (req, res, next) {
      console.log('_------___--_---------', req.params);
      db.put_vehicle_ownership([Number(req.params.vehicleId), null], function (err) {
        if (!err) {
          res.status(200).send("");
        }
      })
    })

    app.delete('/api/vehicle/:vehicleId', function (req, res, next) {
      console.log('_------___--_---------', req.params);
      db.delete_vehicle([Number(req.params.vehicleId)], function (err) {
        if (!err) {
          res.status(200).send("");
        }
      })
    })
});






app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})

module.exports = app;
