const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

// storyModel setups
const StoryModel = require('./stories')

// model name/ schema name
const userSchema = new Schema ({
  username: {type: String, required: true, unique: true, max: 100},
  email: {type: String, required: true, max: 100},
  password: {type: String, required: true, max: 100}
});

// prevent to delete a user with existed stories
userSchema.pre('remove', function(next) {
  StoryModel.find({ user: this.id }, (err, stories) => {
    if (err) {
      next(err)
    } else if (stories.length > 0) {
      next(new Error('This user still has stories!'))
    } else {
      next()
    }
  })
})

// database name, schema name
module.exports = mongoose.model('user', userSchema)