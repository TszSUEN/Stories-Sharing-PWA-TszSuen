const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const storySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true,
    max: 100
  },
  publishDate: {
    type: Date,
    required: true
  },
  ranking: [{
    by_user: String,
    reaction: Number,
    required: false
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  picture: {
    type: Buffer,
    required: true
  },
  pictureType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    max: 600
  }
})

storySchema.virtual('getImageResults').get(function() {
  if (this.picture != null && this.pictureType != null) {
    return `data:${this.pictureType};charset=utf-8;base64,${this.picture.toString('base64')}`
  }
})

// database name, schema name
module.exports = mongoose.model('story', storySchema)