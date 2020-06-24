var express = require('express');
var router = express.Router();
const StoryModel = require('../models/stories')


function check_auth (req, res, next) {
    if (!(req.session && req.session.user)) {
        return res.redirect('/login');
    }
    next();
}

/* GET profile page. */
router.get('/', check_auth, function (req, res, next) {
    res.render('profile', {
        title: 'COM3504 PWA',
        your_username: req.session.user.username,
        your_email: req.session.user
    });
})


module.exports = router;