var express = require('express');
var users = require('../models/users');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  req.session.destroy(function(err){
    console.log("session destroyed");
  });
  res.render('login');
});

router.post('/', function(req, res){
  users.findOne({ email: req.body.email, password: req.body.password }).exec(function(err, data){
    if(data)
    {
      req.session.regenerate(function(){
        req.session.user=data;
        res.json({'result':'success'});
      });
    }
    else {
      res.json({'result': 'wrong!'});
    }
  });
});

module.exports = router;
