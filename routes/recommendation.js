const express = require('express');
const router = express.Router();
const Ranking= require('../CollectiveIntelligence/Ranking');
const stories = require('../Data/recommendations');

function check_auth (req, res, next) {
    if (!(req.session && req.session.user)) {
        return res.redirect('/login');
    }
    next();
}

/* GET recommendation page. */
router.get('/', check_auth, function (req, res, next) {
    res.render('recommendation');
});
// for searching user to get story recommendation
router.post('/', function (req, res, next) {
    let name = req.body.name;
    let ranking= new Ranking();
    let results= ranking.getRecommendations(stories, name, 'sim_pearson');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(results));
    console.log(results);
});

// for searching story to get user recommendation
// router.post('/', check_auth, function (req, res, next) {
//     let name = req.body.name;
//     let ranking= new Ranking();
//     let results= ranking.topMatches(stories, name, 3, 'sim_pearson');
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(results));
//     console.log(results);
// });


module.exports = router;