var express = require('express');
var router = express.Router();
var entrys = require('../models/entrys');
var users = require('../models/users');
/* GET home page. */
router.get('/', function(req, res) {

  if(req.session.user === undefined){
    res.redirect('/login');
  }

  let session = req.session.user;
  // console.log(req.cookie);
  res.render('dashboard', {
    userAuthority: session["authority"],
    title: 'Track entry'
  });
});

router.post('/save',function(req, res){
  users.findOne({name: req.body.name}, function(err, data){
    entrys.create({
          userid: data['_id'],
          inputdate: req.body.date,
          distance: req.body.distance,
          time: req.body.time,
          week: req.body.week
        },
        function(err, track){
          res.json({'message':'success'});
        }
    );
  });
});

router.put('/update/:id',function(req, res){
  entrys.findByIdAndUpdate(req.params.id, {
        inputdate: req.body.date,
        distance: req.body.distance,
        time: req.body.time,
        week: req.body.week
      },
      function(err, track){
        if(err) res.json({ 'message': 'false'});
        else res.json({'message':'success'});
      }
  );
});

router.get('/:from/:to', function(req, res){
  if(req.session.user.authority < 3){
    entrys.
      find({
        userid: req.session.user._id,
        inputdate: { $gte: req.params.from, $lte: req.params.to },
      }).
      populate('userid').
      sort('inputdate').
      limit(100).
      exec(function(err, entrys){
        let result = entrys.slice(0, entrys.length);
        result.push({authority: req.session.user.authority});
        res.json(result);
      });
  }
  else {
    entrys.
      find({
        inputdate: { $gte: req.params.from, $lte: req.params.to },
      }).
      populate('userid').
      sort('inputdate').
      limit(100).
      exec(function(err, entrys){
        // console.log(entrys);
        let result = entrys.slice(0, entrys.length);
        result.push({authority: req.session.user.authority});
        res.json(result);
      });
  }
});

router.delete('/:delid', function(req, res){
  entrys.findByIdAndRemove(req.params.delid, function(err, response){
    if(err) res.json(err);
    else res.json({'result': 'success'});
  });
});
module.exports = router;
