const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
	targetType: { type: String, enum: ['Recipe', 'Photo'], required: true },
	targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
	reported: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

CommentSchema.pre('save', function(next) {
	this.updatedAt = new Date();
	next();
});

module.exports = mongoose.model('Comment', CommentSchema);
