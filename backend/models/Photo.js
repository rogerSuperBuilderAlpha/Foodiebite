const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, value: Number }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', PhotoSchema); 