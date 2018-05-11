var express = require('express');
var users = require('../models/users');
var session = require('express-session');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getname', function(req, res){
  // console.log(req.session);
  if(req.session.user.authority <=2 ){
    res.json([{'name': req.session.user.name}]);
  }
  else
  {
    users.find({},"name", function(err, data){
      console.log(data);
      res.json(data);
    });
  }
});
router.get('/getdistinctname', function(req, res){
  users.distinct('name', function(err, docs){
    res.json(docs.sort())
  });
});
router.get('/getall', function(req, res){
  // console.log(req.session);
  if(req.session.user.authority <=2 ){
    users.find({authority:1, authority:2}, function(err, data){
      res.json(data);
    });
  }
  else
  {
    users.find({}, function(err, data){
      res.json(data);
    });
  }
});

router.post('/save', function(req, res){
  var data = req.body;
  users.findOne({name: data['name']}, function(err, response){
    if(response){
      users.findByIdAndUpdate(response._id, {
        name: data['name'],
        email: data['email'],
        password: data['password'],
        authority: data['authority']
      }, function(err, success){
        if(err)res.json({'result': 'error'});
        else res.json({'result': 'success'});
      });
    }
    else {
      users.create({
            name: data['name'],
            email: data['email'],
            password: data['password'],
            authority: data['authority']
          },
          function(err, track){
            res.json({'message':'success'});
          }
      );
    }
  });
});

router.put('/update/:id',function(req, res){
  console.log(req.body);
  users.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        authority: req.body.authority
      },
      function(err, track){
        if(err) res.json({ 'message': 'error'});
        else res.json({'message':'success'});
      }
  );
});

router.delete('/:delid', function(req, res){
  users.findByIdAndRemove(req.params.delid, function(err, response){
    if(err) res.json(err);
    else res.json({'result': 'success'});
  });
});

module.exports = router;
