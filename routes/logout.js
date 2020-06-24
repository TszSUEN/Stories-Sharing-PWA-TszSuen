var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get('/', function(req, res, next) {
    req.session.user = null;
    res.render('logout');
});


module.exports = router;