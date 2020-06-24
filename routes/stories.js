const express = require('express')
const router = express.Router()
const StoryModel = require('../models/stories')
const UserModel = require('../models/users')
const imageFormats = ['image/jpeg', 'image/png', 'images/gif']


function check_auth (req, res, next) {
  if (!(req.session && req.session.user)) {
    return res.redirect('/login');
  }
  next();
}


// All Stories Route
router.get('/', check_auth, async (req, res) => {
  let query = StoryModel.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const stories = await query.exec()
    res.render('stories/index', {
      stories: stories,
      searchElements: req.query
    })
  } catch {
    res.redirect('/')
  }
})


// New Story Route
router.get('/new', check_auth, function (req, res, next) {
  loadNewPage(res, new StoryModel())
})

// Create Story Route
router.post('/', check_auth, async (req, res) => {
  const story = new StoryModel({
    title: req.body.title,
    user: req.session.user,
    publishDate: new Date(req.body.publishDate),
    ranking: req.body.ranking,
    description: req.body.description
  })
  savePicture(story, req.body.picture)

  try {
    const newStory = await story.save()
    res.redirect(`stories/${newStory.id}`)
  } catch {
    loadNewPage(res, story, true)
  }
})

// Show Story Route
router.get('/:id', check_auth, async (req, res) => {
  try {
    const story = await StoryModel.findById(req.params.id)
                           // .populate('user')
                           // .exec()
    res.render('stories/show', { story: story })
  } catch {
    res.redirect('/')
  }
})


// Edit Story Route -- for admin
router.get('/:id/edit', check_auth, async (req, res) => {
  try {
    const story = await StoryModel.findById(req.params.id)
    loadEditPage(res, story)
  } catch {
    res.redirect('/')
  }
})


// Update Story Route -- for admin
router.put('/:id', check_auth, async (req, res) => {
  let story

  try {
    story = await StoryModel.findById(req.params.id)
    story.title = req.body.title
    story.user = req.body.user
    story.publishDate = new Date(req.body.publishDate)
    story.ranking = req.body.ranking
    story.description = req.body.description
    if (req.body.picture != null && req.body.picture !== '') {
      savePicture(story, req.body.picture)
    }
    await story.save()
    res.redirect(`/stories/${story.id}`)
  } catch {
    if (story != null) {
      loadEditPage(res, story, true)
    } else {
      redirect('/')
    }
  }
})


// Delete Story Page -- for admin
router.delete('/:id', check_auth, async (req, res) => {
  let story
  try {
    story = await StoryModel.findById(req.params.id)
    await story.remove()
    res.redirect('/stories')
  } catch {
    if (story != null) {
      res.render('stories/show', {
        story: story,
        errMessage: 'Could not remove a story'
      })
    } else {
      res.redirect('/')
    }
  }
})


// re-load back to a relevant page
async function loadNewPage(res, story, hasError = false) {
  loadFormPage(res, story, 'new', hasError)
}
// load back to edit page
async function loadEditPage(res, story, hasError = false) {
  loadFormPage(res, story, 'edit', hasError)
}
// load back to a form page
async function loadFormPage(res, story, form, hasError = false) {
  try {
    const users = await UserModel.find({})
    const params = {
      users: users,
      story: story
    }
    if (hasError) {
      if (form === 'edit') {
        params.errMessage = 'Error Updating a Story'
      } else {
        params.errMessage = 'Error Creating a Story'
      }
    }
    res.render(`stories/${form}`, params)
  } catch {
    res.redirect('/stories')
  }
}
// save the picture through filepond
function savePicture(story, pictureEncoded) {
  if (pictureEncoded == null) return
  const picture = JSON.parse(pictureEncoded)
  if (picture != null && imageFormats.includes(picture.type)) {
    story.picture = new Buffer.from(picture.data, 'base64')
    story.pictureType = picture.type
  }
}

module.exports = router