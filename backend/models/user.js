// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  lastLoginDate: String,
  serviceUsage: {
    createQuestionByGPT: Number,
  },
  album: [String],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
