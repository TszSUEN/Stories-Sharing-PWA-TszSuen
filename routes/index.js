const express = require('express')
const router = express.Router()
const StoryModel = require('../models/stories')


function check_auth (req, res, next) {
  if (!(req.session && req.session.user)) {
    return res.redirect('/login');
  }
  next();
}

// get index page
router.get('/', check_auth, async (req, res) => {
  let stories
  try {
    stories = await StoryModel.find().sort({ createdAt: 'desc' }).limit(9).exec()
  } catch {
    stories = []
  }
  res.render('index', { stories: stories })
})

module.exports = router