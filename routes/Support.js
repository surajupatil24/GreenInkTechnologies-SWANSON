var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('Support',null);
});

/* GET home page. */
router.get('/Supportcopy', function(req, res, next) {
    res.render('Supportcopy',null);
});



module.exports = router;