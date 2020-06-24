const express = require('express')
const router = express.Router()
const UserModel = require('../models/users')
const StoryModel = require('../models/stories')


function check_auth (req, res, next) {
  if (!(req.session && req.session.user)) {
    return res.redirect('/login');
  }
  next();
}


// All Users Route
router.get('/', check_auth, async (req, res) => {
  let searchElements = {}
  if (req.query.username != null && req.query.username !== '') {
    searchElements.username = new RegExp(req.query.username, 'i')
  }
  try {
    const users = await UserModel.find(searchElements)
    res.render('users/index', {
      users: users,
      searchElements: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New User Route
router.get('/new', check_auth, function (req, res, next) {
  res.render('users/new', { user: new UserModel() })
})

// Create User Route
router.post('/', check_auth, async (req, res) => {
  const user = new UserModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  try {
    const newUser = await user.save()
    res.redirect(`users/${newUser.id}`)
  } catch {
    res.render('users/new', {
      user: user,
      errMessage: 'Error creating a User'
    })
  }
})

router.get('/:id', check_auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    const stories = await StoryModel.find({ user: user.email }).limit(6).exec()
    res.render('users/show', {
      user: user,
      storiesByUser: stories
    })
  } catch {
    res.redirect('/')
  }
})

// edit a user -- for admin
router.get('/:id/edit', check_auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    res.render('users/edit', { user: user })
  } catch {
    res.redirect('/users')
  }
})

// edit a user -- for admin
router.put('/:id', check_auth, async (req, res) => {
  let user
  try {
    user = await UserModel.findById(req.params.id)
    user.username = req.body.username
    await user.save()
    res.redirect(`/users/${user.id}`)
  } catch {
    if (user == null) {
      res.redirect('/')
    } else {
      res.render('users/edit', {
        user: user,
        errMessage: 'Error updating a User'
      })
    }
  }
})

// delete a user -- for admin
router.delete('/:id', check_auth, async (req, res) => {
  let user
  try {
    user = await UserModel.findById(req.params.id)
    await user.remove()
    res.redirect('/users')
  } catch {
    if (user == null) {
      res.redirect('/')
    } else {
      res.redirect(`/users/${user.id}`)
    }
  }
})

module.exports = router